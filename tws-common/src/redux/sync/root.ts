import { generateSyncId, SyncID } from "tws-common/redux/sync/id"

export type SyncRoot<T> = Readonly<{
	data: T
	id: SyncID
}> & { readonly ty: unique symbol }

/**
 * @deprecated Just use .data instead
 */
export const getSyncRootValue = <T>(sr: SyncRoot<T>): T => sr.data

export const makeSyncRoot = <T>(data: T): SyncRoot<T> =>
	({
		data,
		id: generateSyncId(),
	} as SyncRoot<T>)

/**
 * Sync root, which has some name, which uniquely identifies it.
 */
export type NamedSyncRoot<T, N extends string> = SyncRoot<T>
