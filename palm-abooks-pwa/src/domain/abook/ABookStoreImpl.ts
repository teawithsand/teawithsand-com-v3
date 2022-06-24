import {
	ABookActiveRecord,
	ABookID,
	ABookStore,
} from "@app/domain/abook/ABookStore"
import {
	ABookData,
	ABookFileMetadata,
	ABookMetadata,
} from "@app/domain/abook/typedef"

import MutatingObjectFileStore from "tws-common/file/ofs/MutatingObjectFileStore"
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore"
import KeyValueStore from "tws-common/keyvalue/KeyValueStore"
import { generateUUID } from "tws-common/lang/uuid"

export default class ABookStoreImpl implements ABookStore {
	constructor(
		private readonly dataStore: KeyValueStore<ABookData, ABookID>,
		private readonly fileStore: PrefixObjectFileStore<ABookFileMetadata>,
	) {}

	private generateFileNamePrefix = (bookId: ABookID): string => {
		return bookId + "/"
	}

	private getABookFileStore = (
		bookId: ABookID,
	): PrefixObjectFileStore<ABookFileMetadata> => {
		const prefix = this.generateFileNamePrefix(bookId)

		return new MutatingObjectFileStore(
			{
				mutateKey: async k => prefix + k,
				mutateKeyReverse: async k => k.slice(prefix.length),

				mutatePrefix: async p => prefix + p,

				mutateValue: async v => v,
				mutateValueReverse: async v => v,
			},
			this.fileStore,
		)
	}

	create = async (metadata: ABookMetadata): Promise<string> => {
		const id = generateUUID()

		await this.dataStore.set(id, {
			metadata,
		})

		return id
	}

	delete = async (id: string): Promise<void> => {
		// Deleting ABook = delete source files + main one
		// In fact, we could WAL-log it.
		// TODO(teawithsand): make this store WAL-logged
		const fileStore = this.getABookFileStore(id)
		for await (const sourceId of fileStore.keysWithPrefix("")) {
			await fileStore.delete(sourceId)
		}
		await this.fileStore.delete(id)
	}

	get = async (id: string): Promise<ABookActiveRecord | null> => {
		const data = await this.dataStore.get(id)
		if (!data) return null

		const files = this.getABookFileStore(id)
		let deleted = false
		return {
			id,
			metadata: data.metadata,

			data: {
				id,
				metadata: data.metadata,
			},

			get files() {
				if (deleted) {
					// TODO(teawithsand): handle case when already deleted store
					//  this is important, as it prevents AR from further usage once it was deleted.
				}
				return files
			},

			delete: async () => {
				await this.delete(id)
				deleted = true
			},
			setMetadata: async metadata => {
				if (deleted) {
					return
				}
				await this.dataStore.set(id, {
					metadata,
				})
			},
		}
	}

	has = async (id: string): Promise<boolean> => await this.dataStore.has(id)

	keys = (): AsyncIterable<string> => this.dataStore.keys()
}
