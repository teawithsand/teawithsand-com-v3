import { FileSystemEntryName } from "tws-common/file/nfs"
import { OperationUnsupportedNativeFileSystemError } from "tws-common/file/nfs/error"
import {
	createInMemoryFileSystem,
	InMemoryDirectoryHandle,
	InMemoryFileHandle,
} from "tws-common/file/nfs/memory"

let cached: boolean | null = null
function isWrappingDirSupported() {
	if (cached !== null) return cached
	const input = new HTMLInputElement()
	input.type = "file"
	cached = "webkitdirectory" in input
	return cached
}

export const wrapFileForNativeFileSystem = (files: File[]) => {
	if (files.length !== 1 && !isWrappingDirSupported()) {
		throw new OperationUnsupportedNativeFileSystemError(
			"No webkitdirectory in input",
		)
	}

	const rootName = files[0].webkitRelativePath.split("/", 1)[0]
	const root = createInMemoryFileSystem(rootName)

	for (const f of files) {
		const segments = f.webkitRelativePath.split("/")
		segments.shift() // remove relative part
		const name = segments.pop() // basename + get name of file

		let dir = root
		for (const seg of segments) {
			const entries = dir.getMutableRawEntries()
			if (!entries)
				throw new Error(
					"Unreachable code - path leads to removed directory",
				)

			if (!entries.has(seg as FileSystemEntryName)) {
				entries.set(
					seg as FileSystemEntryName,
					new InMemoryDirectoryHandle(seg as FileSystemEntryName),
				)
			}

			const next = entries.get(seg as FileSystemEntryName)
			if (!next || next.kind === "file")
				throw new Error(
					"Unreachable code - path leads to file or not existent dir",
				)

			dir = next
		}

		const entries = dir.getMutableRawEntries()
		if (!entries) {
			throw new Error("Unreachable code - got removed dir target")
		}
		entries.set(
			name as FileSystemEntryName,
			new InMemoryFileHandle(f, f.name as FileSystemEntryName),
		)
	}

	return root
}
