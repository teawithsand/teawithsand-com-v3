import { KeyedLocks } from "tws-common/lang/lock/keyed/KeyedLocks"
import { WebKeyedLocks } from "tws-common/lang/lock/keyed/WebKeyedLocks"
import { Lock, LockAdapter } from "tws-common/lang/lock/Lock"
import { simpleSleep } from "tws-common/lang/sleep"

const testLockAdapter = async (adapter: LockAdapter) => {
	const lock = new Lock(adapter)

	let isTaskRunning = false
	const promises = []
	for (let i = 0; i < 30; i++) {
		const t = async () => {
			const unlock = await lock.lock()
			try {
				expect(isTaskRunning).toBe(false)
				isTaskRunning = true
				await simpleSleep(50 + Math.random() * 10)
			} finally {
				isTaskRunning = false
				unlock()
			}
		}

		promises.push(t())
	}

	await Promise.all(promises)
}

const doTest = (
	name: string,
	setup: () => Promise<KeyedLocks>,
	cleanup: () => Promise<void>,
) => {
	let locks: KeyedLocks
	beforeEach(async () => {
		locks = await setup()
	})
	afterEach(async () => {
		await cleanup()
	})
	describe(name, () => {
		it("locks on given key exclusively", async () => {
			const adapter = locks.getLockAdapter("asdf", {
				mode: "exclusive",
			})

			await testLockAdapter(adapter)
		})
		// TODO(teawithsand): add more tests here
	})
}

doTest(
	"WebKeyedLocks",
	async () => new WebKeyedLocks(),
	async () => {
		// noop
	},
)
