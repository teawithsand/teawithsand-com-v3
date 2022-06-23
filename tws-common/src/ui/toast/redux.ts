import { createAction, createReducer } from "@reduxjs/toolkit"
import { WritableDraft } from "immer/dist/internal"
import { Toast, ToastId } from "tws-common/ui/toast/toast"

export type ToastState = {
	toasts: Toast[]
}

const prefix = "tws-common/toast"

export const addToast = createAction<Toast>(`${prefix}/addToast`)
export const removeToast = createAction<ToastId>(`${prefix}/removeToast`)

export const toastReducer = createReducer<ToastState>(
	{
		toasts: [],
	},
	builder =>
		builder
			.addCase(addToast, (state, action) => {
				state.toasts = state.toasts.filter(
					v => v.id !== action.payload.id,
				)
				state.toasts.push(action.payload)
				state.toasts = sortToasts(state.toasts)
			})
			.addCase(removeToast, (state, action) => {
				state.toasts = state.toasts.filter(v => v.id !== action.payload)
				state.toasts = sortToasts(state.toasts)
			}),
)

const sortToasts = <T extends Toast[] | WritableDraft<Toast[]>>(
	toasts: T,
): T => {
	toasts.sort((a, b) => {
		let v = -(a.createdTimestamp - b.createdTimestamp)
		if (v === 0) {
			v = -(a.counter - b.counter)
		}

		return v
	})

	return toasts
}
