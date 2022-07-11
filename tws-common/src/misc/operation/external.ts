import { Lock } from "tws-common/lang/lock/Lock"
import { Operation } from "tws-common/misc/operation/action"
import { useErrorWallManger } from "tws-common/react/components/error-wall"
import { useSimpleSuspenseManager } from "tws-common/react/components/suspense"

export const wrapOperationToErrorWallAndSimpleSuspense = <C, D, R>(
	op: Operation<C, D, R>,
): Operation<C, D, R> => {
	return wrapOperationToSimpleSuspense(wrapOperationToErrorWall(op))
}

export const wrapOperationToErrorWall = <C, D, R>(
	op: Operation<C, D, R>,
): Operation<C, D, R> => {
	return (config: C) => {
		const manager = useErrorWallManger()
		const executor = op(config)

		return async (data: D): Promise<R> => {
			return manager.addErrorFromPromise(executor(data))
		}
	}
}

export const wrapOperationToSimpleSuspense = <C, D, R>(
	op: Operation<C, D, R>,
): Operation<C, D, R> => {
	return (config: C) => {
		const manager = useSimpleSuspenseManager()
		const executor = op(config)

		return async (data: D): Promise<R> => {
			return manager.claimPromise(executor(data))
		}
	}
}

export const wrapOperationWithLock = <C, D, R>(
	op: Operation<C, D, R>,
	lock: Lock,
): Operation<C, D, R> => {
	return (config: C) => {
		const executor = op(config)

		return async (data: D): Promise<R> =>
			await lock.withLock(async () => await executor(data))
	}
}
