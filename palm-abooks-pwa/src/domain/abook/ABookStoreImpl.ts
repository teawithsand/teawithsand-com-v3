import {
	ABookActiveRecord,
	ABookData,
	ABookFileMetadata,
	ABookID,
	ABookMetadata,
	ABookStore,
} from "@app/domain/abook/ABookStore"
import MutatingObjectFileStore from "tws-common/file/ofs/MutatingObjectFileStore"
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore"
import KeyValueStore from "tws-common/keyvalue/KeyValueStore"
import { generateUUID } from "tws-common/lang/uuid"

export default class ABookStoreImpl implements ABookStore {
	constructor(
		private readonly metadataStore: KeyValueStore<ABookData, ABookID>,
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

		await this.metadataStore.set(id, {
			metadata,
		})

		return id
	}

	delete = async (id: string): Promise<void> => {
		await this.fileStore.delete(id)
	}

	get = async (id: string): Promise<ABookActiveRecord | null> => {
		const data = await this.metadataStore.get(id)
		if (!data) return null

		return {
			id,
			metadata: data.metadata,

			files: this.getABookFileStore(id),

			delete: async () => {
				await this.delete(id)
			},
			setMetadata: async metadata => {
				await this.metadataStore.set(id, {
					metadata,
				})
			},
		}
	}

	has = async (id: string): Promise<boolean> =>
		await this.metadataStore.has(id)

	keys = (): AsyncIterable<string> => this.metadataStore.keys()
}
