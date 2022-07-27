// TODO(teawithsand): make trailing slash stuff work with get parameters, as now they will fail

export const absolutizePath = (
	domain: string,
	path: string,
	options?: {
		protocol?: string
		trailingSlash?: boolean | null
	},
) => {
	const trailingSlash =
		options?.trailingSlash === null ? null : options?.trailingSlash ?? false
	if (!path.startsWith("/")) {
		path = "/" + path
	}

	const fixDomain = (d: string) => (d.endsWith("/") ? d.slice(0, -1) : d)

	const fixResult = (r: string) => {
		if (trailingSlash === true) {
			r = ensureTrailingSlash(r)
		} else if (trailingSlash === false) {
			r = removeTrailingSlash(r)
		}
		
		return r
	}

	const domainSplit = domain.split("://")
	if (domainSplit.length === 1) {
		return fixResult(fixDomain(domainSplit[0]) + path)
	} else if (domainSplit.length === 2) {
		const proto = options?.protocol ?? domainSplit[0] ?? "https"

		const newDomain = [proto, fixDomain(domainSplit[1])].join("://")

		return fixResult(newDomain + path)
	} else {
		throw new Error(`Bad domain passed: ${domain}`)
	}
}

export const removeTrailingSlash = (path: string) => {
	while (path && path.endsWith("/")) {
		path = path.slice(0, -1)
	}

	return path
}

export const ensureTrailingSlash = (path: string) => {
	if (!path.endsWith("/")) {
		return path + "/"
	} else {
		return path
	}
}
