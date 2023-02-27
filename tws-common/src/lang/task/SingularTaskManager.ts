import Task from "tws-common/lang/task/Task"

type TaskData = {
	readonly promise: Promise<void>
	readonly cancel: () => void
	readonly isCanceled: boolean
}

/**
 * @deprecated Use DefaultTaskManager instead.
 */
export default class SingularTaskManager {
	private currentTaskData: TaskData | null = null
	private lastTaskData: TaskData | null = null

	private innerSubmitTask = (task: Task) => {
		const ctx = { isCanceled: false }
		const promise = task(ctx)

		const td: TaskData = {
			get isCanceled() {
				return ctx.isCanceled
			},
			promise,
			cancel: () => {
				ctx.isCanceled = true
			},
		}

		this.lastTaskData = this.currentTaskData
		this.currentTaskData = td
	}

	isCanceledOrIdle = () => {
		if (!this.currentTaskData) return true
		if (this.currentTaskData.isCanceled) return true
		return false
	}

	cancel = () => {
		if (this.currentTaskData) {
			this.currentTaskData.cancel()
			this.lastTaskData = this.currentTaskData
		}
	}

	submitTask = (task: Task) => {
		this.cancel()
		this.innerSubmitTask(task)
	}
}
