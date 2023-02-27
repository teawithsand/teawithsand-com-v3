import { latePromise } from "tws-common/lang/latePromise"
import Task from "tws-common/lang/task/Task"
import TaskManager from "tws-common/lang/task/TaskManager"

export default class DefaultTaskManager implements TaskManager {
	private readonly idleTaskQueue: {
		task: Task
		resolve: () => void
		reject: (e: any) => void
	}[] = []
	private readonly runningTaskCounter = 0

	constructor(private readonly maxParallelTasks: number = 0) {}

	private maybeExecuteTask = () => {
		if (this.idleTaskQueue.length > 0) {
			if (this.maxParallelTasks) {
				if (this.runningTaskCounter < this.maxParallelTasks) {
					const data = this.idleTaskQueue.shift()
					if (!data) throw new Error("unreachable code")

					const { task, resolve, reject } = data
					task({
						isCanceled: false,
					})
						.then(resolve)
						.catch(reject)
						.finally(() => {
							this.maybeExecuteTask()
						})
				}
			}
		}
	}

	submitTask = (task: Task): Promise<void> => {
		const [p, resolve, reject] = latePromise<void>()
		this.idleTaskQueue.push({
			task,
			resolve,
			reject,
		})
		this.maybeExecuteTask()
		return p
	}
}
