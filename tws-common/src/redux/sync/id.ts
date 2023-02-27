import { generateUUID } from "tws-common/lang/uuid"

/**
 * Type of identifier used to determine if two components are in sync.
 */
export type SyncId = string & { readonly ty: unique symbol }
export const generateSyncId = <T extends SyncId>(): T => generateUUID() as T
