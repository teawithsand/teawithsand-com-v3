import { isSSR } from "tws-common/ssr"

export const DEFAULT_LANGUAGE = "en-US"

export const getPreferredUserLanguage = (ssrFallback: string): string => {
	if (isSSR()) {
		return ssrFallback
	}
	return (
		navigator?.language ||
		(navigator as any)?.userLanguage ||
		DEFAULT_LANGUAGE
	)
}
