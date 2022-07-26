import React, { useContext } from "react"
import { DEFAULT_LANGUAGE, Language } from "tws-common/trans/language"

export type StaticTranslation = () => string
export type KeyedTranslation = () => string

export type TranslationObject = {}

export default class Translator<T extends TranslationObject> {
	constructor(
		private translations: Map<Language, T>,
		private fallbackLanguage: Language = DEFAULT_LANGUAGE,
	) {
		if (!translations.has(fallbackLanguage))
			throw new Error(
				`Fallback language "${fallbackLanguage}" not present in provided languages: ${[
					...translations.keys(),
				]
					.map(v => `"${v}"`)
					.join(", ")}`,
			)
	}

	getTranslationForLanguage = (lang?: Language): T => {
		const res = this.translations.get(lang ?? this.fallbackLanguage)
		if (!res) return this.translations.get(this.fallbackLanguage) as T
		return res
	}
}

export type TranslatorContext<T extends TranslationObject> = React.Context<
	Translator<T>
>
export const createTranslatorContext = <T extends TranslationObject>(
	translator: Translator<T>,
): TranslatorContext<T> => {
	return React.createContext<Translator<T>>(translator)
}

export const useTranslator = <T extends TranslationObject>(
	ctx: TranslatorContext<T>,
): Translator<T> => useContext(ctx)
