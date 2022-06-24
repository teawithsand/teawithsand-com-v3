import { ABookID } from "@app/domain/abook/ABookStore"

export const libraryAddABookFromLocalFSPath = "/library/abook/add"
export const libraryListABookPath = "/library/abook/list"
export const libraryABookIndex = "/library/abook"
export const libraryABookViewPath = (id: ABookID) =>
	"/library/abook/view?id=" + encodeURIComponent(id)
export const localPlayerPath = "/player/local"
