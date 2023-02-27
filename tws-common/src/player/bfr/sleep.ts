import { Store } from "redux"
import { objectEquals } from "tws-common/lang/equal"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { onSleepDone, onSleepStateChanged } from "tws-common/player/bfr/actions"
import { BFRSleepConfig, BFRState } from "tws-common/player/bfr/state"

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRSleep<T> {
	private releaseReduxStore: (() => void) | null = null
	private currentSleepData: {
		taskHandle: any
		realDuration: number
		startedTimestamp: PerformanceTimestampMs
		config: BFRSleepConfig
	} | null = null

	private readonly atom = new DefaultTaskAtom()

	constructor(
		private readonly store: Store<T>,
		selector: (storeState: T) => BFRState<any, any>,
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			const sleepConfig = state.sleepConfig
			const playerConfig = state.playerConfig

			if (playerConfig !== null) {
				if (
					!playerConfig.isPlayingWhenReady ||
					(state.playerConfig.playlist.data?.sources.length ?? 0) ===
						0
				) {
					this.releaseSleepTask()
				} else {
					this.submitSleepConfig(sleepConfig)
				}
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private submitSleepConfig = (config: BFRSleepConfig | null) => {
		// Reset sleep:
		// 1. If config changed/mismatch
		// 2. When paused(done above)

		if (this.currentSleepData !== null && config === null) {
			this.releaseSleepTask()
		} else if (this.currentSleepData === null && config !== null) {
			this.setSleepTask(config)
		} else if (this.currentSleepData !== null && config !== null) {
			// If config mismatch
			// Then reset sleep
			// It's ok
			// I guess...
			// We do not really want to continue
			// especially that some features may want to have different real duration set
			// depending on config
			//
			// In the end this behavior can always be changed
			if (!objectEquals(this.currentSleepData.config, config)) {
				this.setSleepTask(config)
			}
		}
	}

	private emitSleepStateChanged = () => {
		if (this.currentSleepData !== null) {
			this.store.dispatch(
				onSleepStateChanged({
					lastSetAt: this.currentSleepData.startedTimestamp,
				}),
			)
		} else {
			this.store.dispatch(onSleepStateChanged(null))
		}
	}

	private setSleepTask = (config: BFRSleepConfig) => {
		this.releaseSleepTask(false)

		const now = getNowPerformanceTimestamp()
		const claim = this.atom.claim()

		let { durationMs: duration } = config
		duration = Math.ceil(duration)

		const taskHandle = setTimeout(() => {
			if (!claim.isValid) {
				return
			}
			this.store.dispatch(onSleepDone())
		}, duration)

		this.currentSleepData = {
			config,
			taskHandle,
			realDuration: duration,
			startedTimestamp: now,
		}

		this.emitSleepStateChanged()
	}

	private releaseSleepTask = (emit = true) => {
		if (this.currentSleepData !== null) {
			clearTimeout(this.currentSleepData.taskHandle)
			this.currentSleepData = null

			if (emit) {
				this.emitSleepStateChanged()
			}
		}
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.releaseSleepTask()
			this.atom.invalidate()

			this.releaseReduxStore = null
		}
	}
}
