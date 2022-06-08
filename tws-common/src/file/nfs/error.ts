export default class NativeFileSystemError extends DOMException {}

/**
 * Thrown when entry was removed while some operations were performed on it.
 */
export class EntryNotFoundNativeFileSystemError extends NativeFileSystemError {}


/**
 * Thrown when expected file but got dir or vice versa.
 */
export class InvalidEntryTypeNativeFileSystemError extends NativeFileSystemError {}
