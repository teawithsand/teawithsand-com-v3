import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"

export class SimpleSuspenseManager {
	constructor(public readonly parentManager: SimpleSuspenseManager | null) {}

	private readonly innerBus = new DefaultStickyEventBus(0)

	get claimCountBus(): StickySubscribable<number> {
		return this.innerBus
	}

	claim = () => {
		this.innerBus.emitEvent(this.innerBus.lastEvent + 1)

		let isClosed = false
		return () => {
			if (isClosed) {
				return
			}
			isClosed = true

			this.innerBus.emitEvent(this.innerBus.lastEvent - 1)
		}
	}

	/**
	 * Creates claim, which lasts until promise passed as argument is resolved.
	 */
	claimPromise = async <T>(promise: Promise<T>): Promise<T> => {
		const release = this.claim()
		try {
			return await promise
		} finally {
			release()
		}
	}
}
