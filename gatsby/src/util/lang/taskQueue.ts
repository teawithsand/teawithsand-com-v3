import { latePromise } from "./latePromise"

export type Task<T> = () => Promise<T>

type WrappedTask = {
	task: Task<any>
	resolve: (value: any) => void
	reject: (err: any) => void
}

/**
 * A queue, which ensures that only one task runs at a time.
 */
export class TaskQueue {
	private tasks: WrappedTask[] = []
	private isRunning: boolean = false
	constructor() {}

	private runTask = (task: WrappedTask) => {
		this.isRunning = true

		task
			.task()
			.then(task.resolve)
			.catch(task.reject)
			.finally(() => {
				const nextTask = this.tasks.shift()
				if (nextTask) {
					this.runTask(nextTask)
				} else {
					this.isRunning = false
				}
			})
	}

	/**
	 * Drops all scheduled but not yet executed tasks stored in queue.
	 */
	clearQueue = () => {
		this.tasks.splice(0, this.tasks.length)
	}

	/**
	 * Schedules task in queue and returns promise, which resolves once provided task is done.
	 * In other words: it's as-if task's promise was returned.
	 */
	scheduleTask = <T>(task: Task<T>): Promise<T> => {
		const [promise, resolve, reject] = latePromise<T>()
		const wrappedTask = {
			task,
			resolve,
			reject,
		}

		if (!this.isRunning) {
			this.runTask(wrappedTask)
		} else {
			this.tasks.push(wrappedTask)
		}

		return promise
	}
}
