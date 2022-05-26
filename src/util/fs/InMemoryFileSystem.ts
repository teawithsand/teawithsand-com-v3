import FileSystem, {
	File,
	FileEntry,
	FileSeekMode,
	FileSystemEntryKind,
	FS_APPEND,
	FS_CREATE,
	FS_EXCL,
	FS_READ,
	FS_TRUNC,
	FS_WRITE,
} from "@app/util/fs/FileSystem"
import FileSystemError, {
	FileSystemErrorCode,
} from "@app/util/fs/FileSystemError"
import {
	isAbsolute,
	iteratePathEntries,
	joinPath,
	makeAsyncIterable,
} from "@app/util/fs/path"

type EntryFile = {
	type: FileSystemEntryKind.File
	data: ArrayBuffer
}

type EntryDir = {
	type: FileSystemEntryKind.Dir
	entries: Map<string, FileSystemEntry>
}

type EntrySymlink = {
	type: FileSystemEntryKind.Symlink
	to: string
}

type EntryMount = {
	type: FileSystemEntryKind.Mount
	fs: FileSystem
}

type FileSystemEntry = EntryFile | EntryDir | EntrySymlink | EntryMount

/**
 * Reference implementation of file system.
 * Uses in-memory backend.
 */
export default class InMemoryFileSystem implements FileSystem {
	mkdir = (path: string): Promise<void> => {
		throw new Error("Method not implemented.")
	}
	
	rmdir = (path: string): Promise<void> => {
		throw new Error("Method not implemented.")
	}

	unlink = (path: string): Promise<void> => {
		throw new Error("Method not implemented.")
	}

	private rootDir: EntryDir = {
		type: FileSystemEntryKind.Dir,
		entries: new Map(),
	}

	list = (path: string): AsyncIterable<FileEntry> => {
		// root FS has no concept of current directory
		// so resolve absolute path and relative ones very same way

		let entry: FileSystemEntry = this.rootDir
		const pathParts = [...iteratePathEntries(path)]
		for (let i = 0; i < pathParts.length; i++) {
			const pathPart = pathParts[i]
			if (entry.type === FileSystemEntryKind.Dir) {
				const localEntry = entry.entries.get(pathPart)
				if (!localEntry)
					throw new FileSystemError(
						`Path ${path} was not found`,
						FileSystemErrorCode.NOT_FOUND,
					)
				entry = localEntry
			} else if (entry.type === FileSystemEntryKind.Mount) {
				return entry.fs.list(pathParts.slice(i + 1).join("/"))
			} else if (entry.type === FileSystemEntryKind.File) {
				throw new FileSystemError(
					`Path ${path} was not found`,
					FileSystemErrorCode.NOT_FOUND,
				)
			} else if (entry.type === FileSystemEntryKind.Symlink) {
				if (isAbsolute(entry.to) || i === 0) {
					return this.list(
						joinPath(entry.to, pathParts.slice(i + 1).join("/")),
					)
				} else {
					return this.list(
						joinPath(
							pathParts.slice(0, i).join("/"),
							entry.to,
							pathParts.slice(i + 1).join("/"),
						),
					)
				}
			}
		}

		if (entry.type === FileSystemEntryKind.Dir) {
			return makeAsyncIterable<FileEntry>(
				[...entry.entries.entries()].map(([k, e]) => ({
					kind: e.type,
					name: k,
					path: joinPath(path, k),
					size:
						e.type === FileSystemEntryKind.File
							? e.data.byteLength
							: -1,
				})),
			)
		} else if (entry.type === FileSystemEntryKind.File) {
			throw new FileSystemError(
				`Path ${path} is file`,
				FileSystemErrorCode.INVALID_OPERATION,
			)
		} else if (entry.type === FileSystemEntryKind.Mount) {
			return entry.fs.list("/")
		} else if (entry.type === FileSystemEntryKind.Symlink) {
			if (isAbsolute(entry.to)) {
				return this.list(entry.to)
			} else {
				return this.list(joinPath(path, entry.to))
			}
		} else {
			throw new Error("unreachable code")
		}
	}

	open = (path: string, flags: number): Promise<File> => {
		let parentEntry: EntryDir | undefined = undefined
		let entry: FileSystemEntry | undefined = this.rootDir
		const pathParts = [...iteratePathEntries(path)]
		for (let i = 0; i < pathParts.length; i++) {
			const pathPart = pathParts[i]
			if (entry === undefined) {
				throw new FileSystemError(
					`Path ${path} was not found`,
					FileSystemErrorCode.NOT_FOUND,
				)
			} else if (entry.type === FileSystemEntryKind.Dir) {
				const localEntry = entry.entries.get(pathPart)

				if (!localEntry && i !== pathParts.length - 1)
					throw new FileSystemError(
						`Path ${path} was not found`,
						FileSystemErrorCode.NOT_FOUND,
					)

				if (!localEntry) parentEntry = entry
				entry = localEntry
			} else if (entry.type === FileSystemEntryKind.Mount) {
				return entry.fs.open(pathParts.slice(i + 1).join("/"), flags)
			} else if (entry.type === FileSystemEntryKind.File) {
				throw new FileSystemError(
					`Path ${path} was not found`,
					FileSystemErrorCode.NOT_FOUND,
				)
			} else if (entry.type === FileSystemEntryKind.Symlink) {
				if (isAbsolute(entry.to) || i === 0) {
					return this.open(
						joinPath(entry.to, pathParts.slice(i + 1).join("/")),
						flags,
					)
				} else {
					return this.open(
						joinPath(
							pathParts.slice(0, i).join("/"),
							entry.to,
							pathParts.slice(i + 1).join("/"),
						),
						flags,
					)
				}
			}
		}

		if (entry === undefined) {
			if (!parentEntry) throw new Error("unreachable code")

			if (flags & FS_CREATE) {
				parentEntry.entries.set(pathParts[pathParts.length - 1], {
					type: FileSystemEntryKind.File,
					data: new ArrayBuffer(0),
				})

				return this.open(path, flags & ~FS_EXCL & ~FS_CREATE)
			} else {
				throw new FileSystemError(
					`Path ${path} does not exist`,
					FileSystemErrorCode.NOT_FOUND,
				)
			}
		} else if (entry.type === FileSystemEntryKind.Dir) {
			throw new FileSystemError(
				`Path ${path} is dir`,
				FileSystemErrorCode.INVALID_OPERATION,
			)
		} else if (entry.type === FileSystemEntryKind.File) {
			const theEntry = entry
			let pos = 0

			if (flags & FS_EXCL) {
				throw new FileSystemError(
					"Can't override file with O_EXCL",
					FileSystemErrorCode.INVALID_STATE,
				)
			}

			if (flags & FS_TRUNC || flags & FS_CREATE) {
				entry.data = new ArrayBuffer(0)
			}
			if (flags & FS_APPEND) {
				pos = entry.data.byteLength
			}

			return Promise.resolve({
				position: async () => pos,
				read: async buf => {
					if (!(flags & FS_READ)) {
						throw new FileSystemError(
							"File wasn't opened for reading",
							FileSystemErrorCode.INVALID_OPERATION,
						)
					}

					const dst = new Uint8Array(buf)
					const src = new Uint8Array(
						theEntry.data.slice(pos, buf.byteLength),
					)
					dst.set(src)
					pos += src.length
					return src.length
				},
				write: async buf => {
					if (!(flags & FS_WRITE)) {
						throw new FileSystemError(
							"File wasn't opened for writing",
							FileSystemErrorCode.INVALID_OPERATION,
						)
					}
					if (buf.byteLength + pos < theEntry.data.byteLength) {
						new Uint8Array(
							buf.slice(pos, buf.byteLength + pos),
						).set(new Uint8Array(buf))
					} else {
						// reallocate here
						const newBuffer = new ArrayBuffer(
							theEntry.data.byteLength + buf.byteLength,
						)
						const newBufferView = new Uint8Array(newBuffer)

						newBufferView.set(new Uint8Array(theEntry.data))
						newBufferView.set(
							new Uint8Array(buf),
							theEntry.data.byteLength,
						)

						theEntry.data = newBuffer
					}

					pos += buf.byteLength
					return buf.byteLength
				},
				flush: async () => {}, // noop,
				close: async () => {}, // noop
				seek: async (to, how) => {
					if (!isFinite(to) || Math.round(to) !== to)
						throw new FileSystemError(
							"Seek offset must be finite integer",
							FileSystemErrorCode.INVALID_VALUE,
						)
					if (how === FileSeekMode.SeekEnd) {
						pos = Math.min(
							theEntry.data.byteLength,
							Math.max(0, theEntry.data.byteLength - to),
						)
					} else if (how === FileSeekMode.SeekSet) {
						pos = Math.min(
							theEntry.data.byteLength,
							Math.max(0, to),
						)
					} else if (how === FileSeekMode.SeekBy) {
						pos = Math.min(
							theEntry.data.byteLength,
							Math.max(0, pos + to),
						)
					}
				},
			})
		} else if (entry.type === FileSystemEntryKind.Mount) {
			return entry.fs.open("/", flags)
		} else if (entry.type === FileSystemEntryKind.Symlink) {
			if (isAbsolute(entry.to)) {
				return this.open(entry.to, flags)
			} else {
				return this.open(joinPath(path, entry.to), flags)
			}
		} else {
			throw new Error("unreachable code")
		}
	}
}
