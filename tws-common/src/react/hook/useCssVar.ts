import { useMemo } from "react"
import { requireNoSSR } from "tws-common/ssr"

// Note: for now does not work due to CSP policy
export default <P extends Array<any>>(name: string, params: P): string => {
	requireNoSSR()

	return useMemo(
		() => getComputedStyle(document.documentElement).getPropertyValue(name),
		params,
	)
}
