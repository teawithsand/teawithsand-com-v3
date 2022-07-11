/**
 * Factory for OperationExecutor.
 * Capable of using hooks and stuff.
 *
 * Also, takes config, for configuration I guess...
 *
 * @deprecated use new suspense/error boundary/react-query instead
 */
export type Operation<C, D, R> = (config: C) => OperationExecutor<D, R>
/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export type OperationExecutor<D, R> = (data: D) => Promise<R>
/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export type OperatonMiddleware<C, D, R, NC, ND, NR> = (
	operation: Operation<C, D, R>,
) => Operation<NC, ND, NR>
/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
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
 *
 * @deprecated use new suspense/error boundary/react-query instead
 */
export const createOperation = <C, D, R>(
	action: Operation<C, D, R>,
): Operation<C, D, R> => action
