export type Path = string | string[]

export const assemblePath = (path: Path): string => {
	if (typeof path === "string") return path
	return path.join("/")
}

export const disassemblePath = (path: Path): string[] => {
	if (path instanceof Array) return path
	return path.split("/")
}

/*
export function* iteratePathEntries(p: string) {
	const entries = p.split("/")
	let skipNextCtr = 0
	for (const e of entries) {
		if (e === "") continue
		if (e === ".") continue
		if (e === "..") {
			skipNextCtr++
			continue
		}
		if (skipNextCtr > 0) {
			skipNextCtr--
			continue
		}

		yield e
	}
}

export const joinPath = (...paths: string[]): string =>
	paths.map(p => canonizePath(p)).join("/")

export const isAbsolute = (p: string) => p.length >= 1 && p[0] === "/"
export const canonizePath = (p: string): string =>
	[...iteratePathEntries(p)].join("/")

export const canonizePathParts = (path: Path): string => {
	if (path instanceof Array) {
		path = path.join("/")
	}
	return canonizePath(path)
}

*/
