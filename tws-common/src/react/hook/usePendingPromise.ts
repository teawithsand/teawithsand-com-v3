import { useEffect, useState } from "react"

export type PendingPromiseState<R extends {}, H extends {}> =
	| {
			status: "idle"
			header?: undefined
			promise?: undefined
			result?: undefined
			error?: undefined
	  }
	| {
			status: "loading"
			header: H
			promise: Promise<R>

			result?: undefined
			error?: undefined
	  }
	| {
			status: "done"
			header: H
			promise: Promise<R>

			result: R
			error?: undefined
	  }
	| {
			status: "error"
			header: H
			promise: Promise<R>
			error: any
			result?: undefined
	  }

export const usePendingPromise = <R extends {}, H extends {}>(): [
	PendingPromiseState<R, H>,
	(header: H, promise: Promise<R>) => void,
] => {
	const [currentPromiseData, setCurrentPromiseData] = useState<
		[H, Promise<R>] | null
	>(null)
	const [currentPromiseResult, setCurrentPromiseResult] = useState<
		PendingPromiseState<R, H>
	>({
		status: "idle",
	})

	useEffect(() => {
		if (currentPromiseData !== null) {
			const [header, currentPromise] = currentPromiseData
			currentPromise
				.then((data: R) => {
					setCurrentPromiseResult({
						status: "done",
						header,
						promise: currentPromise,
						result: data,
					})
				})
				.catch((e: any) => {
					setCurrentPromiseResult({
						status: "error",
						header,
						promise: currentPromise,
						error: e,
					})
				})
		}
	}, [currentPromiseData])

	const setPromise = (header: H, promise: Promise<R>) => {
		setCurrentPromiseResult({
			status: "loading",
			header,
			promise,
		})
		setCurrentPromiseData([header, promise])
	}

	return [currentPromiseResult, setPromise]
}