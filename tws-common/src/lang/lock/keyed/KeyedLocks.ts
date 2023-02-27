import {
	Lock,
	LockAdapter,
	RWLock,
	RWLockAdapter,
} from "tws-common/lang/lock/Lock"

export interface KeyedLockOptions {
	mode: "exclusive" | "shared"
}

export interface KeyedRWLockOptions {
	// none for now
}

export abstract class KeyedLocks {
	abstract getLockAdapter(key: string, options: KeyedLockOptions): LockAdapter
	abstract getRWLockAdapter(
		key: string,
		options: KeyedRWLockOptions,
	): RWLockAdapter

	getLock = (key: string, options: KeyedLockOptions): Lock =>
		new Lock(this.getLockAdapter(key, options))
	getRWLock = (key: string, options: KeyedRWLockOptions): RWLock =>
		new RWLock(this.getRWLockAdapter(key, options))
}
