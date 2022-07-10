import { ErrorExplainer } from "tws-common/misc/error-explainer/explainer"

type ErrorExplainerBuilderEntry<R> = (e: any) => {
	result: R
} | null

interface ClazzConstructor<T> {
	new (): T
}

export class ErrorExplainerBuilder<R> {
	constructor(private readonly fallback: ErrorExplainer<R>) {}
	private entries: ErrorExplainerBuilderEntry<R>[] = []

	addClassExplainer = <T>(
		clazz: ClazzConstructor<T>,
		explainer: (instance: T) => R,
	) => {
		this.entries.push(e => {
			if (e instanceof clazz) {
				return {
					result: explainer(e as T),
				}
			} else {
				return null
			}
		})
	}

	build = (): ErrorExplainer<R> => {
		const entries = [...this.entries]
		const fallback = this.fallback

		return err => {
			for (const entry of entries) {
				const res = entry(err)
				if (res !== null) {
					return res.result
				}
			}

			return fallback(err)
		}
	}
}
