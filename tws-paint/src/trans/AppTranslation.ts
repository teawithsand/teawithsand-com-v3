import AppTranslationEN_US from "@app/trans/AppTranslationEN_US"

import { CommonTranslation } from "tws-common/trans/common"
import { Language } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	makeTranslationHooks,
} from "tws-common/trans/Translator"

export default interface AppTranslation {
	common: CommonTranslation
	meta: {
		title: string
		description: string
		siteName: string
		siteKeywords: string[]
		siteAddress: string
	}
	error: {
		unknown: string
	}
}

const translations = new Map<Language, AppTranslation>()

translations.set("en-US", AppTranslationEN_US)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

const hooks = makeTranslationHooks(TranslatorContext)

export const useAppTranslation = hooks.useTranslation
export const useAppTranslationSelector = hooks.useTranslationSelector
export const useTranslator = hooks.useTranslator
