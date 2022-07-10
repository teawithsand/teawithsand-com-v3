import { MutationKey, useMutation } from "react-query"
import { GTaskRunner } from "tws-common/misc/gtask/impl"
import { Operation } from "tws-common/misc/gtask/operation/action"

export * from "./action"
export * from "./external"

const extendMutationKey = (mk: MutationKey, elem: unknown) => {
	if (typeof mk === "string") {
		return [mk, elem]
	} else {
		return [...mk, elem]
	}
}

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
	key: MutationKey,
	config: C,
	operation: Operation<C, D, R>,
) => {
	const executor = operation(config)

	const mutation = useMutation(
		extendMutationKey(key, executor),
		async (data: D) => await executor(data),
	)

	return {
		run: mutation.mutateAsync,
		...mutation,
	}
}

export const useOperationOnGTaskWithMetadata = <
	C,
	D,
	R,
	T extends GTaskRunner<M>,
	M,
>(
	key: MutationKey,
	runner: T,
	config: C,
	metadata: M,
	operation: Operation<C, D, R>,
) => {
	const executor = useOperationExecutor(config, operation)

	const mutation = useMutation(
		extendMutationKey(key, executor),
		async (data: D) => {
			const handle = runner.putTask({
				metadata: metadata,
				task: async () => {
					return await executor(data)
				},
			})

			await handle.promise
		},
	)

	return {
		run: mutation.mutateAsync,
		...mutation,
	}
}

export const useOperationOnGTask = <C, D, R, T extends GTaskRunner<M>, M>(
	key: MutationKey,
	runner: T,
	config: C,
	operation: Operation<C, D, R>,
) => {
	const executor = useOperationExecutor(config, operation)

	const mutation = useMutation(
		extendMutationKey(key, executor),
		async (arg: { metadata: M; data: D }) => {
			const { metadata, data } = arg
			const handle = runner.putTask({
				metadata: metadata,
				task: async () => {
					return await executor(data)
				},
			})

			await handle.promise
		},
	)

	return {
		run: mutation.mutateAsync,
		...mutation,
	}
}
