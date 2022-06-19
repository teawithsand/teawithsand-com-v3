import {
	KeyedLockOptions,
	KeyedLocks,
} from "tws-common/lang/lock/keyed/KeyedLocks"
import { Lock, LockAdapter } from "tws-common/lang/lock/Lock"

export default class MwKeyedLocks<T extends KeyedLockOptions>
	implements KeyedLocks<T>
{
	constructor(
		private readonly inner: KeyedLocks<T>,
		private readonly keyMutator: (key: string) => string,
	) {}
    
	getLockAdapter = (key: string, options: T): LockAdapter =>
		this.inner.getLock(this.keyMutator(key), options)

	getLock = (key: string, options: T): Lock =>
		this.inner.getLock(this.keyMutator(key), options)
}
