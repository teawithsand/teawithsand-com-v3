import localforage, { INDEXEDDB, LOCALSTORAGE, WEBSQL } from "localforage"
import { extendPrototype } from "localforage-startswith"

export { INDEXEDDB, LOCALSTORAGE, WEBSQL }

export default extendPrototype(localforage)
export type LocalForage = ReturnType<typeof extendPrototype>
