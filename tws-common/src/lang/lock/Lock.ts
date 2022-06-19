export type Unlock = () => void

export interface LockAdapter {
	lock(): Promise<Unlock>
}

/**
 * Simple wrapper on LockAdapter, which provides additional features and makes using lock adapter simple and less error-prone.
 */
export class Lock {
	constructor(public readonly adapter: LockAdapter) {}

	lock = () => this.adapter.lock()

	withLock = async <T>(cb: () => Promise<T>): Promise<T> => {
		const unlock = await this.lock()
		try {
			return await cb()
		} finally {
			unlock()
		}
	}
}
