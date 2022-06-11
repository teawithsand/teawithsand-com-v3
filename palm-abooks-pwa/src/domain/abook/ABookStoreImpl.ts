import ABookStore, {
	ABookEntryAddData,
	ABookMetadata,
	ABookReadProjection,
} from "@app/domain/abook/ABookStore"
import { StoredFileObject } from "tws-common/file/ofs/ObjectFileStore"

export default class ABookStoreImpl implements ABookStore {
	getAllABookData = (id: string): Promise<ABookReadProjection | null> => {
		throw new Error("Method not implemented.")
	}

	deleteABook = (id: string): Promise<boolean> => {
		throw new Error("Method not implemented.")
	}

	createABook = (id: string, metadata: ABookMetadata): Promise<void> => {
		throw new Error("Method not implemented.")
	}

	setMetadata = (id: string, metadata: ABookMetadata): Promise<void> => {
		throw new Error("Method not implemented.")
	}

	deleteABookEntry = (abookId: string, entryId: string): Promise<boolean> => {
		throw new Error("Method not implemented.")
	}

	addABookEntry = (
		abookId: string,
		data: ABookEntryAddData,
	): Promise<string> => {
		throw new Error("Method not implemented.")
	}

	getFile = (
		abookId: string,
		entryId: string,
	): Promise<StoredFileObject | null> => {
		throw new Error("Method not implemented.")
	}
}
