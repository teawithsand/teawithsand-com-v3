import { isSSR } from "tws-common/ssr"

/**
 * List of languages for translating language to simple and vice versa.
 */
export type LanguageList = [Language, SimpleLanguage][]

/**
 * List of all languages for sake of
 */
export const languages: Readonly<LanguageList> = [
	["en-US", "en"],
	["pl-PL", "pl"],
	["ru-RU", "ru"],
]

const languageToSimple: Map<Language, SimpleLanguage> = (() => {
	const map = new Map()
	for (const [l, s] of languages) {
		if (map.has(l)) continue
		map.set(l, s)
	}
	return map
})()

const simpleToLanguage: Map<SimpleLanguage, Language> = (() => {
	const map = new Map()
	for (const [l, s] of languages) {
		if (map.has(s)) continue
		map.set(s, l)
	}
	return map
})()

/**
 * Enum of arr languages in format language-territory, like en-US
 */
export type Language = "en-US" | "pl-PL" | "ru-RU"
export type SimpleLanguage = "en" | "pl" | "ru"

export const DEFAULT_LANGUAGE: Language = "en-US"

export const unsimplifyLanguage = (lang: SimpleLanguage): Language => {
	lang = lang.toLowerCase() as SimpleLanguage
	const v = simpleToLanguage.get(lang)
	if (!v) throw new Error(`Invalid simple language: ${lang}`)
	return v
}

export const simplifyLanguage = (lang: Language): SimpleLanguage => {
	const res = parseLanguage(lang)
	const v = languageToSimple.get(
		`${res.simpleLanguage}-${res.country}` as Language,
	)
	if (!v) throw new Error(`Invalid language: ${lang}`)
	return v
}

export const recoverLanguageFromString = (
	navigatorLanguage: string,
): Language | null => {
	navigatorLanguage = navigatorLanguage.trim()
	navigatorLanguage.replace("_", "-")

	let language: Language | null = null
	if (/^[a-zA-Z]{2}$/.test(navigatorLanguage)) {
		try {
			language = unsimplifyLanguage(navigatorLanguage as SimpleLanguage)
		} catch (e) {
			// ignore
		}
	} else if (/^[a-zA-Z]{2}-[a-zA-Z]{2}$/.test(navigatorLanguage)) {
		const parsed = parseLanguage(navigatorLanguage)
		if (languageToSimple.has(parsed.language as Language)) {
			language = parsed.language as Language
		} else if (
			simpleToLanguage.has(parsed.simpleLanguage as SimpleLanguage)
		) {
			language = unsimplifyLanguage(
				parsed.simpleLanguage as SimpleLanguage,
			)
		}
	}

	return language
}

export const getPreferredUserLanguage = (
	ssrFallback: Language,
	fallback?: Language,
): Language => {
	if (isSSR()) {
		return ssrFallback
	}

	const navigatorLanguage =
		(navigator as any)?.userLanguage || navigator?.language || ""
	return (
		recoverLanguageFromString(navigatorLanguage) ??
		fallback ??
		DEFAULT_LANGUAGE
	)
}

export const parseLanguage = (
	lang: string,
): {
	language: string // may not be registered
	simpleLanguage: string // may not be registered
	country: string // may not be registered
} => {
	if (!/^[a-zA-Z]{2}-[a-zA-Z]{2}$/.test(lang)) {
		throw new Error(`Invalid language provided ${lang}`)
	}

	const [text, country] = lang.split("-")

	return {
		simpleLanguage: text.toLowerCase(),
		country: country.toUpperCase(),
		language: `${text.toLowerCase()}-${country.toUpperCase()}`,
	}
}
