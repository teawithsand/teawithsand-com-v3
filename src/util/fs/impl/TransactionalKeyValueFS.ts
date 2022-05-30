import File from "@app/util/fs/File"
import FS, { OpenFileOptions } from "@app/util/fs/FS"
import {
	CURRENT_DIR_ENTRY,
	EMPTY_ENTRY,
	walkOverPath,
} from "@app/util/sfs/Path"

export interface KeyValueTransactionFactory<K, V> {
	begin(mode: "readonly" | "readwrite"): Promise<KeyValueTransaction<K, V>>
}

export interface KeyValueTransaction<K, V> {
	get(key: K): Promise<V | null>
	put(key: K, value: V): Promise<void>

	abort(): Promise<void>
	commit(): Promise<void>
}

export enum KeyValueEntryType {
	FILE_HEADER = 1,
	DIR = 2,
	SYMLINK = 4,
	FILE_CHUNK = 5,
	FILE_PARTIAL_CHUNK = 6,
}

export type KeyValueEntryMetadata =
	| {
			type: KeyValueEntryType.FILE_HEADER
			chunkCount: number
			hasPartialChunk: number
	  }
	| {
			type: KeyValueEntryType.DIR
			children: string[]
	  }
	| {
			type: KeyValueEntryType.SYMLINK
			to: string
	  }
	| {
			type: KeyValueEntryType.FILE_CHUNK
			buffer: ArrayBuffer
	  }
	| {
			type: KeyValueEntryType.FILE_PARTIAL_CHUNK
			buffer: ArrayBuffer
	  }

/**
 * A file system, which works on everything, which:
 * 1. Provides key-value storage of string to arbitrary binary data.
 * 2. Provides transactions, which allow multiple keys to be modified atomically.
 */
export default class TransactionalKeyValueFS {
	constructor(
		private nodeAdapter: KeyValueTransactionFactory<
			string,
			KeyValueEntryMetadata
		>,
	) {
		throw new Error("NIY")
	}
}
