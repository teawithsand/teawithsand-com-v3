import "navigator.locks"
import { latePromise } from "tws-common/lang/latePromise"
import {
	KeyedLockOptions,
	KeyedLocks,
} from "tws-common/lang/lock/keyed/KeyedLocks"
import { LockAdapter, RWLockAdapter } from "tws-common/lang/lock/Lock"
import WebLock from "tws-common/webapi/weblock/WebLock"

export class WebKeyedLocks extends KeyedLocks {
	getLockAdapter = (key: string, options: KeyedLockOptions): LockAdapter => {
		const wl = new WebLock(key)

		return {
			lock: async () => {
				const [locked, resolveLocked] = latePromise<void>()
				const [done, resolveDone] = latePromise<void>()

				wl.claim({
					exclusive: options.mode === "exclusive",
					opWhenAcquired: async () => {
						resolveLocked()

						await done
					},
				})

				await locked

				return () => resolveDone()
			},
		}
	}

	getRWLockAdapter = (key: string): RWLockAdapter => {
		return {
			read: this.getLockAdapter(key, { mode: "shared" }),
			write: this.getLockAdapter(key, { mode: "exclusive" }),
		}
	}
}

/**
 * In fact, web keyed locks under the hood is singleton, so this is fine.
 */
export const GLOBAL_WEB_KEYED_LOCKS = new WebKeyedLocks()
