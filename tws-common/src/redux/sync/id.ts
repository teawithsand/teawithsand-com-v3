import { generateUUID } from "tws-common/lang/uuid"

/**
 * Type of identifier used to determine if two components are in sync.
 */
export type SyncID = string & { readonly ty: unique symbol }
export const generateSyncId = <T extends SyncID>(): T => generateUUID() as T