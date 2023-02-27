import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"

/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export class ErrorWallManager {
	constructor(public readonly parent: ErrorWallManager | null) {}

	private readonly innerErrorsBus = new DefaultStickyEventBus<any[]>([])

	get errorsBus(): StickySubscribable<any[]> {
		return this.innerErrorsBus
	}

	clear = () => {
		this.innerErrorsBus.emitEvent([])
	}

	removeError = (error: any) => {
		this.innerErrorsBus.emitEvent(
			this.errorsBus.lastEvent.filter(e => e !== error),
		)
	}

	addError = (error: any) => {
		this.innerErrorsBus.emitEvent([...this.errorsBus.lastEvent, error])

		return () => {
			this.innerErrorsBus.emitEvent(
				this.errorsBus.lastEvent.filter(e => e !== error),
			)
		}
	}

	/**
	 * Creates promise, which adds error to this manager, if error occurred.
	 * Returned promise still throws.
	 */
	addErrorFromPromise = async <T>(promise: Promise<T>): Promise<T> => {
		try {
			return await promise
		} catch (e) {
			this.addError(e)
			throw e
		}
	}
}
