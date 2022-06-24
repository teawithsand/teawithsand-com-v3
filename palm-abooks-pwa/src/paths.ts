import { ABookID } from "@app/domain/abook/ABookStore"

export const abookLibraryAddFromLocalFSPath = "/library/abook/add"
export const abookLibraryListPath = "/library/abook/list"
export const abookLibraryIndexPath = "/library/abook"
export const abookLibraryViewPath = (id: ABookID) =>
	"/library/abook/view?id=" + encodeURIComponent(id)
export const playerLocalPath = "/player/local"
