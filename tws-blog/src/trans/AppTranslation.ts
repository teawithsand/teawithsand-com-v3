import AppTranslationEN_US from "@app/trans/AppTranslationEN_US"

import { CommonTranslation } from "tws-common/trans/common"
import {
	DEFAULT_LANGUAGE,
	getPreferredUserLanguage,
} from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"

export interface CommonTranslationInfo {
	twitter: string
	github: string
	linkedIn: string
	email: string
}

export default interface AppTranslation {
	common: CommonTranslation
	info: CommonTranslationInfo

	title: string
	description: string

	layout: {
		navbar: {
			brandName: string
			blogPostList: string
			appList: string
			tagList: string
			twitter: string
			facebook: string
			linkedin: string
			github: string
			contact: string
		}
	}
	contact: {
		title: string
		text: string
		
		twitter: string
		facebook: string
		linkedIn: string
		github: string
		email: string
	}
}

const translations = new Map<string, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationEN_US)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

export const useAppTranslation = (): AppTranslation =>
	useTranslator(TranslatorContext).getTranslationForLanguage(
		getPreferredUserLanguage(DEFAULT_LANGUAGE),
	)

export const useAppTranslationSelector = <T>(s: (t: AppTranslation) => T): T =>
	s(useAppTranslation())
