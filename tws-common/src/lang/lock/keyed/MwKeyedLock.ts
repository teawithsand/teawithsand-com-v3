import {
	KeyedLockOptions,
	KeyedLocks,
	KeyedRWLockOptions,
} from "tws-common/lang/lock/keyed/KeyedLocks"
import { LockAdapter, RWLockAdapter } from "tws-common/lang/lock/Lock"

export class MwKeyedLocks extends KeyedLocks {
	constructor(
		private readonly inner: KeyedLocks,
		private readonly keyMutator: (key: string) => string,
	) {
		super()
	}

	getLockAdapter = (key: string, options: KeyedLockOptions): LockAdapter =>
		this.inner.getLock(this.keyMutator(key), options)

	getRWLockAdapter = (
		key: string,
		options: KeyedRWLockOptions,
	): RWLockAdapter =>
		this.inner.getRWLockAdapter(this.keyMutator(key), options)
}
