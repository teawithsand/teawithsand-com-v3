import { LOCATION_DATA_LOCK } from "@app/domain/location/store"

import {
	createOperation,
	wrapOperationToErrorWallAndSimpleSuspense,
	wrapOperationWithLock,
} from "tws-common/misc/operation"

export const loadLocationOperation = wrapOperationWithLock(
	wrapOperationToErrorWallAndSimpleSuspense(
		createOperation((config: void) => {
			return async (data: { id: string }) => {
				throw new Error("NIY")
			}
		}),
	),
	LOCATION_DATA_LOCK.readLock,
)
