import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { State } from "@app/domain/redux/store"

import { removeToast, ToastDisplay } from "tws-common/ui/toast"

const InnerToastDisplay = () => {
	const toasts = useSelector((s: State) => s.toasts.toasts)
	const dispatch = useDispatch()

	console.error({ toasts })
	return (
		<ToastDisplay
			toasts={toasts}
			onClose={id => {
				dispatch(removeToast(id))
			}}
		/>
	)
}

export default InnerToastDisplay
