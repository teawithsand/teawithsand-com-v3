import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import BaseError from "tws-common/lang/error"
import { latePromise } from "tws-common/lang/latePromise"
import { DefaultTaskAtom, TaskAtomHandle } from "tws-common/lang/task/TaskAtom"

export enum GTaskState {
	WAITING = "waiting",
	RUNNING = "running",
	DONE_CANCELLED = "doneCancelled",
	DONE_OK = "doneOk",
	DONE_ERROR = "doneError",
}

/**
 * Error, which is stored in promise when it's cancelled in WAITING state.
 */
export class GTaskWaitingCancelledError extends BaseError {}

export type GTaskHandle<M, T> = Readonly<{
	state: GTaskState

	metadata: M

	promise: Promise<T>
	cancel: () => void
}>

export type GTaskContext = {
	readonly claim: TaskAtomHandle
}

export type GTask<T> = (ctx: GTaskContext) => Promise<T>

export interface GTaskData<M, T> {
	metadata: M
	task: GTask<T>
}

export interface GTaskRunner<M> {
	putTask: <T>(data: GTaskData<M, T>) => GTaskHandle<M, T>
}

/**
 * Simplest possible task runner, which does nothing but runs task.
 */
export const SimpleTaskRunner: GTaskRunner<void> = {
	putTask: <T>(data: GTaskData<void, T>): GTaskHandle<void, T> => {
		const atom = new DefaultTaskAtom()
		let state = GTaskState.RUNNING
		const promise = (async () => {
			try {
				const res = await data.task({
					claim: atom.claim(),
				})
				state = GTaskState.DONE_OK
				return res
			} catch (e) {
				state = GTaskState.DONE_ERROR
				throw e
			}
		})()

		return {
			cancel: () => {
				atom.invalidate()
			},
			metadata: data.metadata,
			promise,
			get state() {
				return state
			},
		}
	},
}

export class MWGTaskRunner<M, I extends GTaskRunner<M>>
	implements GTaskRunner<M>
{
	constructor(
		public readonly inner: I,
		private readonly wrapTask?: <T>(data: GTaskData<M, T>) => GTask<T>,
	) {}

	putTask = <T>(data: GTaskData<M, T>): GTaskHandle<M, T> => {
		const clone = { ...data }

		if (this.wrapTask) {
			clone.task = this.wrapTask(data)
		}

		return this.inner.putTask(clone)
	}
}

export class QueueGTaskRunner<M> implements GTaskRunner<M> {
	private readonly queue: {
		data: GTaskData<M, unknown>
		claim: TaskAtomHandle
		run: () => void
	}[] = []
	private isIdle = true

	private readonly innerCurrentTaskHandle =
		new DefaultStickyEventBus<GTaskHandle<M, unknown> | null>(null)

	get currentTaskHandle(): StickySubscribable<GTaskHandle<
		M,
		unknown
	> | null> {
		return this.innerCurrentTaskHandle
	}

	putTask = <T>(data: GTaskData<M, T>): GTaskHandle<M, T> => {
		const atom = new DefaultTaskAtom()
		let state = GTaskState.WAITING

		const [promise, resolve, reject] = latePromise<T>()

		const claim = atom.claim()

		const handle: GTaskHandle<M, T> = {
			cancel: () => {
				atom.invalidate()
				if (state === GTaskState.WAITING) {
					state = GTaskState.DONE_CANCELLED
					// TODO(teawithsand): instantly remove element from queue
					//  rather than wait until it's released by some task
					reject(
						new GTaskWaitingCancelledError(
							"Task was cancelled before it was ran",
						),
					)
				}
			},
			metadata: data.metadata,
			promise,
			get state() {
				return state
			},
		}

		const currentElement = {
			claim,
			data,
			run: () => {
				if (state === GTaskState.WAITING) {
					this.innerCurrentTaskHandle.emitEvent(handle)
					state = GTaskState.RUNNING
					data.task({
						claim,
					})
						.then(v => {
							if (state === GTaskState.RUNNING) {
								state = GTaskState.DONE_OK
							}
							resolve(v)
						})
						.catch(e => {
							if (state === GTaskState.RUNNING) {
								state = GTaskState.DONE_ERROR
							}
							reject(e)
						})
						.finally(() => {
							for (;;) {
								const element = this.queue.shift()
								if (!element) break
								if (!element.claim.isValid) continue

								element.run()
								return
							}

							// no task ran, so noop
							this.innerCurrentTaskHandle.emitEvent(null)
						})
				}
			},
		}

		if (this.isIdle) {
			currentElement.run()
		} else {
			this.queue.push(currentElement)
		}

		return handle
	}
}

export class GroupRoutingGTaskRunner<
	M extends {
		group: string
	},
> implements GTaskRunner<M>
{
	constructor(
		public readonly runners: Readonly<Map<string, GTaskRunner<M>>>,
		public readonly fallbackRunner: GTaskRunner<M>,
	) {}

	putTask = <T>(data: GTaskData<M, T>): GTaskHandle<M, T> => {
		const group = data.metadata.group
		const runner = this.runners.get(group) ?? this.fallbackRunner
		return runner.putTask(data)
	}
}
