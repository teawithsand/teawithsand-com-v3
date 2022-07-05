import AppTranslationPL from "@app/trans/AppTranslationPL"

import { DEFAULT_LANGUAGE } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"

export default interface AppTranslation {
	appName: string
}

const translations = new Map<string, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationPL)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

export const useAppTranslation = (): AppTranslation =>
	useTranslator(TranslatorContext).getTranslationForLanguage()

export const useAppTranslationSelector = <T>(s: (t: AppTranslation) => T): T =>
	s(useAppTranslation())
