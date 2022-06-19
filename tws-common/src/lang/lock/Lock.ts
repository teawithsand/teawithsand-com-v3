export type Unlock = () => void

export const NoopLockAdapter: LockAdapter = {
	lock: async () => () => {
		// noop
	},
}

export const NoopRWLockAdapter: RWLockAdapter = {
	read: NoopLockAdapter,
	write: NoopLockAdapter,
}

export interface LockAdapter {
	lock(): Promise<Unlock>
}

export interface RWLockAdapter {
	readonly read: LockAdapter
	readonly write: LockAdapter
}

export class RWLock {
	constructor(public readonly adapter: RWLockAdapter) {}

	lockRead = () => this.adapter.read.lock()
	withLockRead = async <T>(cb: () => Promise<T>): Promise<T> => {
		const unlock = await this.lockRead()
		try {
			return await cb()
		} finally {
			unlock()
		}
	}

	lockWrite = () => this.adapter.write.lock()
	withLockWrite = async <T>(cb: () => Promise<T>): Promise<T> => {
		const unlock = await this.lockWrite()
		try {
			return await cb()
		} finally {
			unlock()
		}
	}
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
