export const absolutizePath = (
	domain: string,
	path: string,
	options?: {
		protocol?: string
	},
) => {
	if (!path.startsWith("/")) {
		path = "/" + path
	}

	const fixDomain = (d: string) => (d.endsWith("/") ? d.slice(0, -1) : d)

	const domainSplit = domain.split("://")
	if (domainSplit.length === 1) {
		return fixDomain(domainSplit[0]) + path
	} else if (domainSplit.length === 2) {
		const proto = options?.protocol ?? domainSplit[0] ?? "https"

		const newDomain = [proto, fixDomain(domainSplit[1])].join("://")

		return newDomain + path
	} else {
		throw new Error(`Bad domain passed: ${domain}`)
	}
}
