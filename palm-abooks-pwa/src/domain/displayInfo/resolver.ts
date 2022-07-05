import { Store } from "redux"

import { ABookStore } from "@app/domain/abook/ABookStore"
import { MPlayerPlaylistMetadataType } from "@app/domain/bfr/playlist"
import { displayInfoSetStateResolved } from "@app/domain/displayInfo/actions"
import { DisplayInfoError } from "@app/domain/displayInfo/error"
import {
	DisplayInfo,
	DisplayInfoPlaylist,
	DisplayInfoState,
	DisplayInfoStateResolved,
} from "@app/domain/displayInfo/state"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"
import AppTranslation from "@app/trans/AppTranslation"

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
		store: Store<S>,
		selector: (state: S) => DisplayInfoState,
		private readonly abookStore: ABookStore,
		private readonly: AppTranslation,
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
					;(async () => {
						let info: DisplayInfo | undefined
						try {
							info = await this.runPlaylistDataLoad(claim, data)
						} catch (e) {
							if (claim.isValid) {
								let error = e
								if (!(error instanceof DisplayInfoError)) {
									error = new DisplayInfoError(
										"An error occurred while computing display info",
										e,
									)
								}

								displayInfoSetStateResolved({
									data: {
										type: "error",
										error,
									},
									playlistSyncRootId: id,
								})
								return
							}
						}
						if (info && claim.isValid) {
							store.dispatch(
								displayInfoSetStateResolved({
									data: {
										type: "resolved",
										info: info,
									},
									playlistSyncRootId: id,
								}),
							)
						}
						return
					})()
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
	): Promise<DisplayInfo | undefined> => {
		if (playlist.type !== "bfr") return // we are interested only in playlists with sources loaded

		const bfrPlaylist = playlist.playlist
		const wtpPlaylist = bfrPlaylist.metadata.wtpPlaylist

		const info: Partial<DisplayInfo> = {}

		this.abookStore.get(bfrPlaylist.metadata.type)

		/*			
			let playbackTitle: string
			if (bfrPlaylist.metadata.type === MPlayerPlaylistMetadataType.ABOOK) {
				info.playbackTitle = bfrPlaylist.metadata.abook.metadata.title
			} else if (
				bfrPlaylist.metadata.type === MPlayerPlaylistMetadataType.NONE
			) {
				
			} else {
				throw new Error("Unreachable code")
			}

			*/
		throw new DisplayInfoError("NIY")
		if (!claim.isValid) return
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.taskAtom.invalidate()
			this.releaseReduxStore = null
		}
	}
}
