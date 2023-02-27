export type TaskContext = { readonly isCanceled: boolean }

type Task = (ctx: TaskContext) => Promise<void>
export default Task
