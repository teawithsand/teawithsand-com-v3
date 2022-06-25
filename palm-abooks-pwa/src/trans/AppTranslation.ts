import AppTranslationEN from "@app/trans/AppTranslationEN"

import { DEFAULT_LANGUAGE } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"

export default interface AppTranslation {
	appName: string
	generic: {
		modalClose: string
	}
	common: {
		sureModal: {
			defaultTitle: string
			defaultDescription: string
			confirm: string
			cancel: string
		}
	}
	globalUi: {
		navbar: {
			pageTitle: string
			homePage: string

			abookLibraryDropdown: {
				title: string
				managementPanel: string
				addLocalABook: string
				listABooks: string
			}

			playerDropdown: {
				title: string
				playLocal: string
			}
		}
	}
	player: {
		speedModal: {
			title: string
			currentSpeed: (speed: number) => string
			preservePitch: string
		}
		optionsBar: {
			speed: string
		}
	}
}

const translations = new Map<string, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationEN)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

export const useAppTranslation = (): AppTranslation =>
	useTranslator(TranslatorContext).getTranslationForLanguage()

export const useAppTranslationSelector = <T>(s: (t: AppTranslation) => T): T =>
	s(useAppTranslation())
