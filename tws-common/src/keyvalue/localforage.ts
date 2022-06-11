import localforage from "localforage"
import { extendPrototype } from "localforage-startswith"

export default extendPrototype(localforage)
export type LocalForage = ReturnType<typeof extendPrototype>
