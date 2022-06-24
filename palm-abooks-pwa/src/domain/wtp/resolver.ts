import { Store } from "redux"

import { ABOOK_STORE } from "@app/domain/abook/ABookStore"
import { setWTPError, setWTPResolved } from "@app/domain/wtp/actions"
import {
	WTPPlaylistMetadata,
	WTPPlaylistResolver,
} from "@app/domain/wtp/playlist"
import { WTPSourceResolver } from "@app/domain/wtp/source"
import { WTPState } from "@app/domain/wtp/state"
import { WTPError } from "@app/domain/wtp/WTPError"

import { DefaultTaskAtom, TaskAtomHandle } from "tws-common/lang/task/TaskAtom"
import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { SyncId } from "tws-common/redux/sync/id"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/WTPResolver")

export class WTPResolver<S> {
	private releaseReduxStore: (() => void) | null = null

	private readonly taskAtom = new DefaultTaskAtom()
	private lastPlaylistId: SyncId | null = null

	constructor(
		private readonly store: Store<S>,
		selector: (state: S) => WTPState,
		private readonly wtpPlaylistResolver: WTPPlaylistResolver = new WTPPlaylistResolver(
			ABOOK_STORE,
		),
		private readonly wtpSourceResolver: WTPSourceResolver = new WTPSourceResolver(
			ABOOK_STORE,
		),
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())

			const playlist = state.config.playlist
			if (playlist.id !== this.lastPlaylistId) {
				this.lastPlaylistId = playlist.id

				const claim = this.taskAtom.claim()
				if (playlist.data !== null) {
					this.doResolvePlaylist(playlist.data, claim)
				}
			}
		})

		this.releaseReduxStore = () => {
			unsubscribe()
		}
	}

	private doResolvePlaylist = async (
		meta: WTPPlaylistMetadata,
		claim: TaskAtomHandle,
	) => {
		try {
			if (!claim.isValid) return
			const { playlistMetadata, sources } =
				await this.wtpPlaylistResolver.resolveWTPPlaylist(meta)

			if (!claim.isValid) return

			const playerSources = []
			for (const s of sources) {
				if (!claim.isValid) return
				playerSources.push(
					await this.wtpSourceResolver.resolveWTPSource(s),
				)
			}

			if (!claim.isValid) return
			this.store.dispatch(
				setWTPResolved({
					metadata: playlistMetadata,
					sources: playerSources,
				}),
			)
		} catch (e) {
			let err = e
			if (!(err instanceof WTPError)) {
				err = new WTPError("Filed to resolve WTPPlaylistMetadata", e)
			}
			LOG.warn(
				LOG_TAG,
				"Filed to resolve WTPPlaylist: ",
				meta,
				"Error: ",
				e,
			)
			if (!claim.isValid) return

			this.store.dispatch(setWTPError(err))
		}
	}

	// TODO(teawithsand): implement this resolver's logic with other resolvers
	//  or preferably reimplement it

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.taskAtom.invalidate()
			this.releaseReduxStore = null
		}
	}
}
