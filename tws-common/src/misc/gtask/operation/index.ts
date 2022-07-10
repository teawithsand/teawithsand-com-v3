import { useMutation } from "react-query"
import { Operation } from "tws-common/misc/gtask/operation/action"

export * from "./action"

/**
 * Creates executor from operation.
 * Useful, when action has to be applied to GTR.
 */
export const useOperationExecutor = <C, D, R>(
	config: C,
	action: Operation<C, D, R>,
) => action(config)

/**
 * Uses action directly, without GTaskRunner.
 * Gives utils for tracking task's state and more.
 */
export const useOperation = <C, D, R>(
	config: C,
	operation: Operation<C, D, R>,
) => {
	const executor = operation(config)

	const mutation = useMutation(async (data: D) => await executor(data))

	return {
		run: mutation.mutateAsync,
		...mutation,
	}
}
