import { latePromise } from "tws-common/lang/latePromise"
import { LockAdapter } from "tws-common/lang/lock/Lock"

/**
 * Single JS context-spanning lock, which is just like simple mutex, but on promises.
 */
export class MutexLockAdapter implements LockAdapter {
	private currentPromise: Promise<void> | null = null

	lock = async (): Promise<() => void> => {
		while (this.currentPromise !== null) {
			await this.currentPromise
		}

		const [newPromise, resolve] = latePromise<void>()
		this.currentPromise = newPromise
		return () => {
			this.currentPromise = null
			resolve()
		}
	}
}
