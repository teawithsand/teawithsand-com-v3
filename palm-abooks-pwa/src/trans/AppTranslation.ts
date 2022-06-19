import AppTranslationEN from "@app/trans/AppTranslationEN"

import { DEFAULT_LANGUAGE } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"

export default interface AppTranslation {
	appName: string
}

const translations = new Map<string, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationEN)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

export const useAppTranslation = (): AppTranslation =>
	useTranslator(TranslatorContext).getTranslationForLanguage()
