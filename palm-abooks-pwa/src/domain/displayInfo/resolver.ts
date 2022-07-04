import { Store } from "redux"

import { ABookStore } from "@app/domain/abook/ABookStore"
import { MBFRPlaylist } from "@app/domain/bfr/playlist"
import {
	DisplayInfoPlaylist,
	DisplayInfoState,
} from "@app/domain/displayInfo/state"

import { DefaultTaskAtom, TaskAtomHandle } from "tws-common/lang/task/TaskAtom"
import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { SyncId } from "tws-common/redux/sync/id"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/DisplayInfoResolver")

export class DisplayInfoResolver<S> {
	private releaseReduxStore: (() => void) | null = null

	private readonly taskAtom = new DefaultTaskAtom()
	private lastPlaylistId: SyncId | null = null

	constructor(
		private readonly store: Store<S>,
		selector: (state: S) => DisplayInfoState,
		private readonly abookStore: ABookStore,
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())

			const { data, id } = state.sync.playlist

			if (id !== this.lastPlaylistId) {
				const claim = this.taskAtom.claim()
				this.lastPlaylistId = id

				if (data !== null && data.type === "bfr") {
					LOG.info(
						LOG_TAG,
						"Running non-noop data loading for playlist",
						data,
					)
					this.runPlaylistDataLoad(claim, data)
				}
			}
		})

		this.releaseReduxStore = () => {
			unsubscribe()
		}
	}

	private runPlaylistDataLoad = async (
		claim: TaskAtomHandle,
		playlist: DisplayInfoPlaylist,
	) => {
		if (playlist.type !== "bfr") return // we are interested only in playlists with sources loaded

		if (!claim.isValid) return
		// this.store.dispatch() // TODO(teawithsand): here dispatch resolved data
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.taskAtom.invalidate()
			this.releaseReduxStore = null
		}
	}
}
