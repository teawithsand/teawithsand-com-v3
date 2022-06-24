import { TimestampMs } from "tws-common/lang/time/Timestamp"

export type LoadedABookData = ABookData & {
	id: string
}

export type ABookData = {
	metadata: ABookMetadata
}

export type ABookMetadata = {
	title: string
	description: string
	addedAt: TimestampMs
}
