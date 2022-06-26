import { useEffect, useState } from "react"
import { generateUUID } from "tws-common/lang/uuid"

export type PendingPromiseState<R, H> = (
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
) & {
	runId: string
}

export const usePendingPromise = <R, H>(): [
	PendingPromiseState<R, H>,
	(header: H, promise: Promise<R>) => void,
] => {
	const [currentPromiseData, setCurrentPromiseData] = useState<
		[H, Promise<R>, string] | null
	>(null)
	const [currentPromiseResult, setCurrentPromiseResult] = useState<
		PendingPromiseState<R, H>
	>({
		status: "idle",
		runId: generateUUID(),
	})

	useEffect(() => {
		if (currentPromiseData !== null) {
			const [header, currentPromise, runId] = currentPromiseData
			currentPromise
				.then((data: R) => {
					setCurrentPromiseResult({
						status: "done",
						runId,
						header,
						promise: currentPromise,
						result: data,
					})
				})
				.catch((e: any) => {
					setCurrentPromiseResult({
						status: "error",
						runId,
						header,
						promise: currentPromise,
						error: e,
					})
				})
		}
	}, [currentPromiseData])

	const setPromise = (header: H, promise: Promise<R>) => {
		const runId = generateUUID()
		setCurrentPromiseResult({
			status: "loading",
			runId,
			header,
			promise,
		})
		setCurrentPromiseData([header, promise, runId])
	}

	return [currentPromiseResult, setPromise]
}
