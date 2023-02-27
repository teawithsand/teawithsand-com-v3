/**
 * Type capable of returning human readable error message of type R for any error.
 */
export type ErrorExplainer<R> = (e: any) => R

/**
 * Type of result of promise, which is returned once makeTypedPromiseExplainer was called on promise.
 */
export type ErrorExplainedPromise<T, R> =
	| {
			type: "success"
			value: T
	  }
	| {
			type: "error"
			innerError: any
			explainedError: R
	  }

/**
 * Uses explainer, which replaces promise error value with explained one.
 */
export const makeToErrorPromiseExplainer = <R>(
	explainer: ErrorExplainer<R>,
) => {
	return async <T>(promise: Promise<T>) => {
		try {
			return await promise
		} catch (e) {
			throw explainer(e)
		}
	}
}

/**
 * Uses explainer, which makes promise always resolve to success, but changes result of yielded promise.
 */
export const makeTypedPromiseExplainer = <R>(explainer: ErrorExplainer<R>) => {
	return async <T>(
		promise: Promise<T>,
	): Promise<ErrorExplainedPromise<T, R>> => {
		try {
			const v = await promise
			return {
				type: "success",
				value: v,
			}
		} catch (e) {
			return {
				type: "error",
				innerError: e,
				explainedError: explainer(e),
			}
		}
	}
}

/**
 * Creates object capable of explaining promise errors in any way.
 */
export const makePromiseExplainer = <R>(e: ErrorExplainer<R>) => ({
	toError: makeToErrorPromiseExplainer(e),
	typed: makeTypedPromiseExplainer(e),
})
