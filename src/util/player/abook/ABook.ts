/**
 * AudioBook stored in local DB.
 */
export default interface ABook {
	uuid: string

	title: string
	files: ABookFile[] // in order as they should be played
}

export interface ABookFile {
	url: string
	duration: number | null
}