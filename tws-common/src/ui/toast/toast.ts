import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { getToastCounter } from "tws-common/ui/toast/counter"

export type ToastId = string

// Note: toast should be serializable, so it can be synced across tabs.
// Aside from that, it's ok to put non-serializable stuff in here.
export type Toast = {
	// Unique toast id
	// Required for react to properly handle timeouts
	id: ToastId
	// Used to order toasts
	createdTimestamp: PerformanceTimestampMs
	// Unique counter value to resolve TS conflicts
	counter: number

	livenessSeconds: number
	title: string
	message: string
}

export type CreateToastData = {
	title: string
	message: string
	livenessSeconds: number | null
}

export const createToast = (data: CreateToastData): Toast => ({
	id: generateUUID(),
	createdTimestamp: getNowPerformanceTimestamp(),
	livenessSeconds: data.livenessSeconds ?? 30,
	counter: getToastCounter(),

	title: data.title,
	message: data.message,
})
