import React, { useContext } from "react"
import {
	DEFAULT_LANGUAGE,
	Language,
	useLanguage,
} from "tws-common/trans/language"

export type StaticTranslation = () => string
export type KeyedTranslation = () => string

export type TranslationObject = {}

// TODO(teawithsand): get rid of default export
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

export { Translator }

export type TranslatorContext<T extends TranslationObject> = React.Context<
	Translator<T>
>

export const makeTranslationHooks = <T extends TranslationObject>(
	ctx: TranslatorContext<T>,
) => ({
	useTranslator: (): Translator<T> => useContext(ctx),
	useTranslation: (): T => {
		const lang = useLanguage()
		const translator = useTranslator(ctx)

		return translator.getTranslationForLanguage(lang)
	},
	useTranslationSelector: <E>(s: (obj: T) => E): E => {
		const lang = useLanguage()
		const translator = useTranslator(ctx)

		return s(translator.getTranslationForLanguage(lang))
	},
})

export const createTranslatorContext = <T extends TranslationObject>(
	translator: Translator<T>,
): TranslatorContext<T> => {
	return React.createContext<Translator<T>>(translator)
}

export const useTranslator = <T extends TranslationObject>(
	ctx: TranslatorContext<T>,
): Translator<T> => useContext(ctx)

export const useTranslation = <T extends TranslationObject>(
	ctx: TranslatorContext<T>,
): T => {
	const lang = useLanguage()
	const translator = useTranslator(ctx)

	return translator.getTranslationForLanguage(lang)
}

export const useTranslationSelector = <T extends TranslationObject, E>(
	ctx: TranslatorContext<T>,
	s: (obj: T) => E,
): E => {
	const lang = useLanguage()
	const translator = useTranslator(ctx)

	return s(translator.getTranslationForLanguage(lang))
}
