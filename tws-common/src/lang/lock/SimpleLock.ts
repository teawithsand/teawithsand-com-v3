import { latePromise } from "tws-common/lang/latePromise"
import Lock from "tws-common/lang/lock/Lock"

export default class SimpleLock implements Lock {
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
