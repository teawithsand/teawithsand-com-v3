import { ABOOK_DATA_STORE } from "@app/domain/abook/ABookDataStore"
import { ABOOK_FILE_STORE } from "@app/domain/abook/ABookFileStore"
import {
	ABOOK_COMPOUND_LOCK_ADAPTER,
	ABOOK_LOCK_ADAPTER,
} from "@app/domain/abook/ABookLock"
import ABookStoreImpl from "@app/domain/abook/ABookStoreImpl"
import {
	ABookFileMetadata,
	ABookMetadata,
	LoadedABookData,
} from "@app/domain/abook/typedef"

import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore"
import { RWLock } from "tws-common/lang/lock/Lock"

export type ABookID = string

export interface ABookActiveRecord extends Readonly<LoadedABookData> {
	readonly id: ABookID
	readonly metadata: ABookMetadata
	readonly data: LoadedABookData

	readonly files: ObjectFileStore<ABookFileMetadata>
	delete: () => Promise<void>
	setMetadata(metadata: ABookMetadata): Promise<void>
}

export interface ABookStore {
	create(metadata: ABookMetadata): Promise<ABookID>
	delete(id: ABookID): Promise<void>
	get(id: ABookID): Promise<ABookActiveRecord | null>
	has(id: ABookID): Promise<boolean>
	keys(): AsyncIterable<ABookID>

	// TODO(teawithsand): implement it among all operations performed
	/**
	 * Util lock used to prevent multi-staged operations from overlapping each other.
	 * It should be claimed for as short as it's possible, since it's global for whole ABook store.
	 */
	readonly compoundOperationsLock: RWLock
}

export const ABOOK_STORE: ABookStore = new ABookStoreImpl(
	ABOOK_DATA_STORE,
	ABOOK_FILE_STORE,
	ABOOK_LOCK_ADAPTER,
	ABOOK_COMPOUND_LOCK_ADAPTER,
)
export const useABookStore = (): ABookStore => ABOOK_STORE
