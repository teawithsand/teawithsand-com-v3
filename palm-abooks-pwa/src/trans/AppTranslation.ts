import AppTranslationEN_US from "@app/trans/AppTranslationEN"

import { CommonTranslation } from "tws-common/trans/common"
import { DEFAULT_LANGUAGE } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"

export default interface AppTranslation {
	common: CommonTranslation
	appName: string
	generic: {
		modalClose: string
	}
	oldCommon: {
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
				showPlayerUi: string
			}
		}
	}
	library: {
		abook: {
			flash: {
				abookRemoveSuccessFlash: (name: string) => string
				abookFileRemoveSuccessFlash: (
					abookName: string,
					fileName: string,
				) => string
				abookFileReorderSuccessFlash: (abookName: string) => string
			}
		}
	}
	player: {
		speedModal: {
			title: string
			currentSpeed: (speed: number) => string
			preservePitch: string
		}
		pickLocalFilesModal: {
			title: string
			fileFieldLabel: string
		}
		optionsBar: {
			speed: string
		}
	}
}

const translations = new Map<string, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationEN_US)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

export const useAppTranslation = (): AppTranslation =>
	useTranslator(TranslatorContext).getTranslationForLanguage()

export const useAppTranslationSelector = <T>(s: (t: AppTranslation) => T): T =>
	s(useAppTranslation())
