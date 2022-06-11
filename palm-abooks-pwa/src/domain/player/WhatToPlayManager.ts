import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import PlayerSource from "tws-common/player/source/PlayerSource"

import {
	ABookReadProjection,
	ABOOK_STORE,
} from "@app/domain/newabook/ABookStore"
import SingularTaskManager from "tws-common/lang/task/SingularTaskManager"

export type Playable = {
	type: "abook"
	data: ABookReadProjection
}

export type PlayableLocator = {
	type: "abook"
	id: string
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
	private currentPlayable: Playable | null = null

	private readonly setPlayableTaskManager = new SingularTaskManager()

	private readonly innerEventBus =
		new DefaultStickyEventBus<WhatToPlayManagerState>({
			type: "no-source",
		})

	get eventBus(): StickySubscribable<WhatToPlayManagerState> {
		return this.innerEventBus
	}

	private resolveLocator = async (
		locator: PlayableLocator,
	): Promise<Playable> => {
		if (locator.type === "abook") {
			const abook = await ABOOK_STORE.getAllABookData(locator.id)
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

	setPlayable = (locator: PlayableLocator) => {
		this.setPlayableTaskManager.submitTask(async ctx => {
			const playable = await this.resolveLocator(locator)
			if (ctx.isCanceled) return

			const metadataLoadingResults = playable.data.playableEntries.map(
				m => m.metadata,
			)

			this.innerEventBus.emitEvent({
				type: "running",
				playable,
				metadata: new MetadataBag(metadataLoadingResults),
				sources: playable.data.playableEntries.map(e => e.playerSource),
			})

			// TODO(teawithsand): trigger missing/error metadata loading here + save new metadata to store
		})
	}

	release = () => {
		this.setPlayableTaskManager.submitTask(async ctx => {
			throw new Error(
				"NIY unsetting and releasing stuff like metadata loading, which is pending",
			)
		})
	}
}
