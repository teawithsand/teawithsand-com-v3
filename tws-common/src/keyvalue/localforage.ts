import { default as localforage } from "localforage"
import { INDEXEDDB, LOCALSTORAGE, WEBSQL } from "localforage"
import { extendPrototype } from "localforage-startswith"

extendPrototype(localforage)
const newLocalForage = localforage as ReturnType<typeof extendPrototype>

if (typeof newLocalForage !== "object" || newLocalForage === null) {
	throw new Error("newLocalForage is not object!")
}

if (typeof Object.getPrototypeOf({}).startsWith !== "undefined") {
	throw new Error(
		"object prototype was polluted by extendPrototype from localforage-startswith",
	)
}

if (typeof newLocalForage.startsWith !== "function") {
	throw new Error("expected startsWith, but it's not there")
}

export { INDEXEDDB, LOCALSTORAGE, WEBSQL }
export default newLocalForage
export type LocalForage = typeof newLocalForage
