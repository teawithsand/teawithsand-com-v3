import { Store } from "redux"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import PlayerSource from "tws-common/player/source/PlayerSource"
import { onSleepTimedOut } from "tws-common/reduxplayer/________sleep/actions"
import { BFRState, SleepConfig } from "tws-common/reduxplayer/bfr/state"

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRSleep<T> {
	private releaseReduxStore: (() => void) | null = null
	private currentPlaylistId: string | null = null
	private timeoutHandle: any | null = null

	constructor(
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => BFRState,
		// Adapter for external metadata saving mechanism
		// it has to be
		private readonly saveMetadata: (
			source: PlayerSource,
			result: MetadataLoadingResult,
		) => Promise<void>,
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			const sleepConfig = state.sleepConfig
			const playerState = state.playerState?.playbackState

			if (playerState !== null) {
				if (sleepConfig.duration === null) {
					this.releaseSleepTask()
				} else {
					
				}
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private submitSleepConfig = (config: SleepConfig, force = false) => {
		// Reset sleep: 
		// 1. If config changed
		// 2. If force set to true, since it's set when things like pause occurs
	}

	private releaseSleepTask = () => {
		if (this.timeoutHandle !== null) {
			clearTimeout(this.timeoutHandle)
		}
	}

	private isSleepTaskSet = () => {
		return this.timeoutHandle !== null
	}

	private setSleepTask = (timeoutSeconds: number) => {
		this.timeoutHandle = setTimeout(() => {
			this.store.dispatch(onSleepTimedOut())
		}, Math.ceil(timeoutSeconds))
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.releaseReduxStore = null
		}
	}
}
