import { createAction, createReducer } from "@reduxjs/toolkit"
import { WritableDraft } from "immer/dist/internal"
import { FlashMessage, FlashMessageId } from "tws-common/ui/flash/flash"

export type FlashMessagesState = {
	flashMessages: FlashMessage[]
}

const prefix = "tws-common/flash-messages"

export const addFlashMessage = createAction<FlashMessage>(`${prefix}/addFlash`)
export const removeFlashMessage = createAction<FlashMessageId>(
	`${prefix}/removeFlash`,
)

export const flashMessageReducer = createReducer<FlashMessagesState>(
	{
		flashMessages: [],
	},
	builder =>
		builder
			.addCase(addFlashMessage, (state, action) => {
				state.flashMessages = state.flashMessages.filter(
					v => v.id !== action.payload.id,
				)
				state.flashMessages.push(action.payload)
				state.flashMessages = sortFlashes(state.flashMessages)
			})
			.addCase(removeFlashMessage, (state, action) => {
				state.flashMessages = state.flashMessages.filter(
					v => v.id !== action.payload,
				)
				state.flashMessages = sortFlashes(state.flashMessages)
			}),
)

const sortFlashes = <T extends FlashMessage[] | WritableDraft<FlashMessage[]>>(
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
