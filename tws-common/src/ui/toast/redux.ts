import { createAction, createReducer } from "@reduxjs/toolkit"
import { Toast, ToastId } from "tws-common/ui/toast/toast"

export type ToastState = {
	toasts: {
		// do not use map:
		// 1. It works badly with immer
		// 2. It's not serializable
		[key: string]: Toast
	}
}

const prefix = "tws-common/toast"

export const addToast = createAction<Toast>(`${prefix}/addToast`)
export const removeToast = createAction<ToastId>(`${prefix}/removeToast`)

export const toastReducer = createReducer<ToastState>(
	{
		toasts: {},
	},
	builder =>
		builder
			.addCase(addToast, (state, action) => {
				state.toasts[action.payload.id] = action.payload
			})
			.addCase(removeToast, (state, action) => {
				if (action.payload in state.toasts) {
					delete state.toasts[action.payload]
				}
			}),
)

export const selectToasts = (state: ToastState): Toast[] => {
	const arr = [...Object.values(state.toasts)]

	// TODO(teawithsand): check if reverse sort would be better
	arr.sort((a, b) => {
		let v = -(a.createdTimestamp - b.createdTimestamp)
		if (v === 0) {
			v = -(a.counter - b.counter)
		}

		return v
	})

	return arr
}
