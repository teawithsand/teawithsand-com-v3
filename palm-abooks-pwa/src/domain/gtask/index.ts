import { ABOOK_STORE } from "@app/domain/abook/ABookStore"

import {
	createGTaskRunnerContext,
	GroupRoutingGTaskRunner,
	GTask,
	GTaskData,
	GTaskRunner,
	MWGTaskRunner,
	QueueGTaskRunner,
	SimpleTaskRunner,
} from "tws-common/misc/gtask"

export enum GTaskGroupImpl {
	ABOOK = "abook",
	OTHER = "other",
}

export type GTaskMetadata =
	| {
			group: GTaskGroupImpl.ABOOK
			abookLockType?: "read" | "write"
	  }
	| {
			group: GTaskGroupImpl.OTHER
	  }

const InnerABookTaskRunner = new QueueGTaskRunner()

const ABookTaskRunner = new MWGTaskRunner(
	InnerABookTaskRunner,
	<T>(data: GTaskData<GTaskMetadata, T>): GTask<T> => {
		if (data.metadata.group !== GTaskGroupImpl.ABOOK) {
			throw new Error(
				`unreachable code - invalid task group ${data.metadata.group}`,
			)
		}

		return async ctx => {
			if (data.metadata.group !== GTaskGroupImpl.ABOOK) {
				throw new Error(
					`unreachable code - invalid task group ${data.metadata.group}`,
				)
			}

			if (data.metadata.abookLockType === "read") {
				return await ABOOK_STORE.compoundOperationsLock.withLockRead(
					async () => await data.task(ctx),
				)
			} else {
				return await ABOOK_STORE.compoundOperationsLock.withLockWrite(
					async () => await data.task(ctx),
				)
			}
		}
	},
)

// TODO(teawithsand): rather than use globals here, make all of theses things global for layout only
//  with useEffect hooks

const DefaultRunner = SimpleTaskRunner

const runners = new Map()
runners.set(GTaskGroupImpl.ABOOK, ABookTaskRunner)
runners.set(GTaskGroupImpl.OTHER, DefaultRunner)

export const AppGTaskRunner: GTaskRunner<GTaskMetadata> =
	new GroupRoutingGTaskRunner(runners, DefaultRunner)

// TODO(teawithsand): using this bus implement react component, which handles showing loader thing while
//  some ABook operation is pending
export const ABookGTaskRunnerBus = InnerABookTaskRunner.currentTaskHandle
export const GTaskRunnerContext = createGTaskRunnerContext<
	typeof AppGTaskRunner,
	GTaskMetadata
>(AppGTaskRunner)
