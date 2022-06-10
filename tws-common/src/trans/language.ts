export const DEFAULT_LANGUAGE = "en-US"

export const getPreferredUserLanguage = (): string => {
	return (
		navigator?.language ||
		(navigator as any)?.userLanguage ||
		DEFAULT_LANGUAGE
	)
}
