export type ErrorExplainer<T> = (e: any) => T

export class ErrorExplainerBuilder<T> {
	private inner: ErrorExplainer<T> | null = null
	constructor(private readonly defaultCase: ErrorExplainer<T>) {}

	addMatcherCase = (
		matcher: (e: any) => boolean,
		explainer: ErrorExplainer<T>,
	) => {
		const { inner } = this
		this.inner = e => {
			if (matcher(e)) {
				return explainer(e)
			}
			if (inner) {
				return inner(e)
			} else {
				return this.defaultCase(e)
			}
		}
	}

	build = (): ErrorExplainer<T> => {
		const { inner } = this
		return e => {
			if (inner) return inner(e)
			return this.defaultCase(e)
		}
	}
}

export type ErrorExplainedPromise<T, E> =
	| {
			type: "success"
			value: T
	  }
	| {
			type: "error"
			error: any
			explained: E
	  }

export const explainedPromise = <T, E>(
	p: Promise<T>,
	e: ErrorExplainer<E>,
): Promise<ErrorExplainedPromise<T, E>> =>
	p
		.then(v =>
			Promise.resolve<ErrorExplainedPromise<T, E>>({
				type: "success",
				value: v,
			}),
		)
		.catch(err =>
			Promise.reject<ErrorExplainedPromise<T, E>>({
				type: "error",
				error: err,
				explained: e(err),
			}),
		)
