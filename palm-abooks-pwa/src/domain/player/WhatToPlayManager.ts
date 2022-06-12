import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import PlayerSource, {
	FunctionPlayerSource,
} from "tws-common/player/source/PlayerSource"

import {
	ABookActiveRecord,
	ABookFileMetadata,
	ABookID,
	ABOOK_STORE,
} from "@app/domain/abook/ABookStore"
import DefaultTaskManager from "tws-common/lang/task/DefaultTaskManager"
import { DefaultTaskAtom, TaskAtomHandle } from "tws-common/lang/task/TaskAtom"
import TaskManager from "tws-common/lang/task/TaskManager"
import DefaultMetadataLoader from "tws-common/player/metadata/DefaultMetadataLoader"
import {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "tws-common/player/metadata/Metadata"
import MetadataLoader from "tws-common/player/metadata/MetadataLoader"

export type Playable = {
	type: "abook"
	data: ABookActiveRecord
}

export type PlayableLocator = {
	type: "abook"
	id: ABookID
}

export type WhatToPlayManagerState =
	| {
			type: "no-source"
	  }
	| {
			type: "preparing"
			playable: Playable
	  }
	| {
			type: "running"
			playable: Playable
			metadata: MetadataBag
			sources: PlayerSource[]
	  }

export default class WhatToPlayManager {
	private readonly atom = new DefaultTaskAtom()

	private readonly metadataLoader: MetadataLoader =
		new DefaultMetadataLoader()

	private readonly setPlayableTaskManager: TaskManager =
		new DefaultTaskManager()

	private readonly innerEventBus =
		new DefaultStickyEventBus<WhatToPlayManagerState>({
			type: "no-source",
		})

	get eventBus(): StickySubscribable<WhatToPlayManagerState> {
		return this.innerEventBus
	}

	private loadMetadata = async (
		source: PlayerSource,
	): Promise<MetadataLoadingResult> => {
		let res: MetadataLoadingResult
		try {
			const metadata = await this.metadataLoader.loadMetadata(source)
			res = {
				type: MetadataLoadingResultType.OK,
				metadata,
			}
		} catch (e) {
			res = {
				type: MetadataLoadingResultType.ERROR,
				error: `An error occurred`,
			}
		}

		return res
	}

	private mustResolveLocator = async (
		locator: PlayableLocator,
	): Promise<Playable> => {
		if (locator.type === "abook") {
			const abook = await ABOOK_STORE.get(locator.id)
			if (!abook)
				throw new Error(`Couldn't find abook with id ${locator.id}`)
			return {
				type: "abook",
				data: abook,
			}
		} else {
			throw new Error("unreachable code")
		}
	}

	private handleAbookPlayable = async (
		src: ABookActiveRecord,
		handle: TaskAtomHandle,
	) => {
		const playable: Playable = {
			type: "abook",
			data: src,
		}

		const files: {
			key: string
			metadata: ABookFileMetadata & { type: "playable" }
		}[] = []

		for await (const k of src.files.keys()) {
			if (!handle.isValid) return
			const metadata = await src.files.getMetadata(k)
			if (!metadata || metadata.type !== "playable") continue
			files.push({
				key: k,
				metadata,
			})
		}

		// TODO(teawithsand): here sort all files before doing any additional operations on it

		if (!handle.isValid) return

		const metadataResultsArray = files.map(
			f => f.metadata.metadataLoadingResult,
		)
		const sources = files.map(
			f =>
				// TODO(teawithsand): abstract away this conversion to source
				//  and allow URL sources, which are stored along with empty files
				new FunctionPlayerSource(async () => {
					const obj = await src.files.getFile(f.key)
					const blob = obj?.innerObject
					if (!blob) {
						// TODO(teawithsand): better type of this error should be here
						throw new Error(
							`Filed to load file with key ${f.key} for book ${src.id}`,
						)
					}
					return blob
				}, f.key),
		)
		const ctx: WhatToPlayManagerState = {
			type: "running",
			playable,
			metadata: new MetadataBag([...metadataResultsArray]),
			sources,
		}
		this.innerEventBus.emitEvent(ctx)
		;(async () => {
			// launch background task here
			// load metadata from now on

			for (let i = 0; i < metadataResultsArray.length; i++) {
				if (!handle.isValid) return

				const metadataResultEntry = metadataResultsArray[i]
				if (
					metadataResultEntry === null ||
					metadataResultEntry.type === MetadataLoadingResultType.ERROR
				) {
					const res = await this.loadMetadata(sources[i])
					metadataResultsArray[i] = res

					if (!handle.isValid) return

					await playable.data.files.setMetadata(files[i].key, {
						...files[i].metadata,
						metadataLoadingResult: res,
					})

					if (!handle.isValid) return

					this.innerEventBus.emitEvent({
						...ctx,
						metadata: new MetadataBag([...metadataResultsArray]),
					})
				}
			}
		})()
	}

	setPlayable = async (locator: PlayableLocator): Promise<void> => {
		const playable = await this.mustResolveLocator(locator)
		const handle = this.atom.claim()

		this.innerEventBus.emitEvent({
			type: "preparing",
			playable,
		})

		await this.setPlayableTaskManager.submitTask(async () => {
			if (playable.type === "abook") {
				await this.handleAbookPlayable(playable.data, handle)
			} else {
				throw new Error(`Unknown playable type: ${playable.type}`)
			}
		})
	}

	release = async (): Promise<void> => {
		this.atom.invalidate()
		this.innerEventBus.emitEvent({
			type: "no-source",
		})
	}
}
