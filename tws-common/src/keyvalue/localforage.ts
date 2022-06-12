import * as localforage from "localforage"
import { INDEXEDDB, LOCALSTORAGE, WEBSQL } from "localforage"
import { extendPrototype } from "localforage-startswith"

export { INDEXEDDB, LOCALSTORAGE, WEBSQL }

Object.setPrototypeOf(localforage, {})
extendPrototype(localforage)
const newLocalForage: ReturnType<typeof extendPrototype> = localforage

if (typeof Object.getPrototypeOf({}).startsWith !== "undefined") {
	throw new Error(
		"object prototype was polluted by extendPrototype from localforage-startswith",
	)
}
if (typeof localforage.startsWith !== "function") {
	throw new Error("expected startsWith, but it's not there")
}

export default newLocalForage
export type LocalForage = typeof newLocalForage
