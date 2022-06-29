import { ABookActiveRecord, ABookID, ABookStore } from "@app/domain/abook/ABookStore";
import { ABookData, ABookFileMetadata, ABookMetadata } from "@app/domain/abook/typedef";



import MutatingObjectFileStore from "tws-common/file/ofs/MutatingObjectFileStore";
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore";
import KeyValueStore from "tws-common/keyvalue/KeyValueStore";
import { RWLock, RWLockAdapter } from "tws-common/lang/lock/Lock";
import { generateUUID } from "tws-common/lang/uuid";
import { LOG } from "tws-common/log/logger";
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager";


const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/ABookStoreImpl")

export default class ABookStoreImpl implements ABookStore {
	private readonly lock: RWLock
	public readonly compoundOperationsLock: RWLock
	constructor(
		private readonly dataStore: KeyValueStore<ABookData, ABookID>,
		private readonly fileStore: PrefixObjectFileStore<ABookFileMetadata>,
		lockAdapter: RWLockAdapter,
		private readonly compoundLockAdapter: RWLockAdapter,
	) {
		this.lock = new RWLock(lockAdapter)
		this.compoundOperationsLock = new RWLock(compoundLockAdapter)
	}

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

		await this.lock.withLockWrite(async () => {
			await this.dataStore.set(id, {
				metadata,
			})
		})

		return id
	}

	delete = async (id: string): Promise<void> => {
		// Deleting ABook = delete source files + main one
		// In fact, we could WAL-log it.
		// TODO(teawithsand): make this store WAL-logged
		await this.lock.withLockWrite(async () => {
			LOG.assert(LOG_TAG, `Deleting ABook with id: ${id}`)

			const fileStore = this.getABookFileStore(id)
			for await (const sourceId of fileStore.keysWithPrefix("")) {
				await fileStore.delete(sourceId)
			}
			await this.dataStore.delete(id)
		})
	}

	get = async (id: string): Promise<ABookActiveRecord | null> => {
		const data = await this.lock.withLockRead(
			async () => await this.dataStore.get(id),
		)
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
				await this.lock.withLockWrite(async () => {
					if (await this.dataStore.has(id)) {
						await this.dataStore.set(id, {
							metadata,
						})
					}
				})
			},
		}
	}

	has = async (id: string): Promise<boolean> => await this.dataStore.has(id)

	keys = (): AsyncIterable<string> => this.dataStore.keys()
}