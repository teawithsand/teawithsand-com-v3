import React, { useContext } from "react"
import { latePromise } from "tws-common/lang/latePromise"

export type ConfirmRequester<T> = (
	data: T,
	resolve: (res: boolean) => void,
) => void

export type ConfirmReactContext<T> = React.Context<{
	requestConfirmation: ConfirmRequester<T>
}>

export const createConfirmContext = <T>(
	requestConfirmation: ConfirmRequester<T>,
): ConfirmReactContext<T> =>
	React.createContext({
		requestConfirmation,
	})

export type ConfirmationRequester<T> = (requestData: T) => Promise<boolean>

/**
 * Note: user may want to use some single type for
 */
export const useConfirm = <T>(
	ctx: ConfirmReactContext<T>,
): ConfirmationRequester<T> => {
	// TODO(teawithsand): check if it works with SSR

	return async (data: T) => {
		const [p, resolve] = latePromise<boolean>()

		const res = useContext(ctx)

		res.requestConfirmation(data, resolve)
		return await p
	}
}
