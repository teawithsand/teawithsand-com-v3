import Task from "tws-common/lang/task/Task"

export default interface TaskManager {
	/**
	 * Submits given task and returns promise, which resolves when task is done.
	 */
	submitTask: (task: Task) => Promise<void>
}
