import {
	deleteDB,
	IDBPDatabase,
	openDB,
	unwrap,
	wrap,
} from "idb/with-async-ittr"

import FileStore, {
	Path,
	Reader,
	WriteMode,
	Writer,
} from "@app/util/sfs/FileStore"
import { canonizePathParts } from "@app/util/sfs/path"

const STORE_NAME = "files"

export const openFileDB = async (name: string) => {
	return await openDB(name, 1, {
		upgrade(db) {
			db.createObjectStore(STORE_NAME, {
				// The 'id' property of the object will be the key.
				keyPath: "id",
				// If it isn't explicitly set, create a value by auto incrementing.
				autoIncrement: true,
			})
		},
	})
}

export default class IndexedDBFileStore implements FileStore {
	constructor(
		private readonly db: IDBPDatabase<{
			STORE_NAME: {
				id: number
				path: string
				part: number
				data: ArrayBuffer
			}
		}>,
	) {}

	openForReading = async (key: Path): Promise<Reader> => {
		const path = canonizePathParts(key)

		const store = await this.db
			.transaction(STORE_NAME, "readwrite")
			.objectStore(STORE_NAME)
		const v = store.get(path)
		throw new Error("Method not implemented.")
	}
	openForWriting = (key: Path, mode: WriteMode): Promise<Writer> => {
		throw new Error("Method not implemented.")
	}
	delete = (prefix: Path): Promise<void> => {
		throw new Error("Method not implemented.")
	}
	list = (prefix: Path): AsyncIterable<string> => {
		throw new Error("Method not implemented.")
	}
}
