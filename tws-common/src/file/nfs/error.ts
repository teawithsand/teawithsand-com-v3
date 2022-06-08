export default class NativeFileSystemError extends DOMException {}

/**
 * Thrown when entry was removed while some operations were performed on it.
 */
export class EntryNotFoundNativeFileSystemError extends NativeFileSystemError {}

/**
 * Thrown when expected file but got dir or vice versa.
 */
export class InvalidEntryTypeNativeFileSystemError extends NativeFileSystemError {}

/**
 * Thrown when permission error occurs. For instance,
 */
export class PermissionNativeFileSystemError extends NativeFileSystemError {}

/**
 * Thrown when some operation is not possible. Most likely, due to some feature being polyfilled rather than natively implemented.
 */
export class OperationUnsupportedNativeFileSystemError extends NativeFileSystemError {}

/**
 * Thrown when some argument provided contains invalid value.
 */
export class InvalidArgumentNativeFileSystemError extends NativeFileSystemError {}
