import { Store } from "redux"

import { DisplayInfoState } from "@app/domain/displayInfo/state"

import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
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
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			// TODO(teawithsand): implement this resolver
		})

		this.releaseReduxStore = () => {
			unsubscribe()
		}
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.taskAtom.invalidate()
			this.releaseReduxStore = null
		}
	}
}
