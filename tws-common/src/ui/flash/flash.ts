import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { getFlashMessageCounter } from "tws-common/ui/flash/counter"

export enum FlashMessageVariant {
	INFO = "info",
	DANGER = "danger",
	WARN = "warn",
	SUCCESS = "success",
}

export type FlashMessageId = string

export type FlashMessage = {
	// Unique toast id
	// Required for react to properly handle timeouts
	id: FlashMessageId
	// Used to order toasts
	createdTimestamp: PerformanceTimestampMs
	// Unique counter value to resolve TS conflicts
	counter: number

	variant: FlashMessageVariant
	message: string
}

export type CreateFlashMessageData = {
	message: string
	variant?: FlashMessageVariant
}

export const createFlashMessage = (
	data: CreateFlashMessageData,
): FlashMessage => ({
	id: generateUUID(),
	createdTimestamp: getNowPerformanceTimestamp(),
	counter: getFlashMessageCounter(),
	variant: data.variant ?? FlashMessageVariant.INFO,

	message: data.message,
})
