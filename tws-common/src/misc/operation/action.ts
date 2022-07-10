/**
 * Factory for OperationExecutor.
 * Capable of using hooks and stuff.
 *
 * Also, takes config, for configuration I guess...
 */
export type Operation<C, D, R> = (config: C) => OperationExecutor<D, R>
export type OperationExecutor<D, R> = (data: D) => Promise<R>

export type OperatonMiddleware<C, D, R, NC, ND, NR> = (
	operation: Operation<C, D, R>,
) => Operation<NC, ND, NR>

export type IdentityOperationMiddleware<C, D, R> = OperatonMiddleware<
	C,
	D,
	R,
	C,
	D,
	R
>

/**
 * Noop function, which serves as a helper for creating operations.
 */
export const createOperation = <C, D, R>(
	action: Operation<C, D, R>,
): Operation<C, D, R> => action
