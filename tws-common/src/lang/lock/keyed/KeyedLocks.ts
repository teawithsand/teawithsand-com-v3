import { Lock, LockAdapter } from "tws-common/lang/lock/Lock"

export interface KeyedLockOptions {
	mode: "exclusive" | "shared"
}

export interface KeyedLocks<T extends KeyedLockOptions = KeyedLockOptions> {
	getLockAdapter(key: string, options: T): LockAdapter
	getLock(key: string, options: T): Lock
}
