import AppTranslationPL from "@app/trans/AppTranslationPL"

import { TimestampMs } from "tws-common/lang/time/Timestamp"
import { CommonTranslation } from "tws-common/trans/common"
import { DEFAULT_LANGUAGE, Language } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	makeTranslationHooks,
} from "tws-common/trans/Translator"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

export default interface AppTranslation {
	common: CommonTranslation
	appName: string
	meta: {
		title: string
		description: string
	}
	layout: {
		navbar: {
			search: string
			publishing: string
			homePage: string
			brandName: string
			location: {
				title: string
				menu: string
				locateMe: string
				addLocation: string
				showLocations: string
			}
		}
	}
	location: {
		display: {
			noDescription: string
			noName: string
			latitude: (v: number) => string
			longitude: (v: number) => string
			editLabel: string
			deleteLabel: string
		}
		form: {
			nameLabel: string
			descriptionLabel: string
			latitudeLabel: string
			longitudeLabel: string
			validation: {
				name: {
					notEmpty: string
				}
				longitude: {
					notEmpty: string
					invalid: string
				}
				latitude: {
					notEmpty: string
					invalid: string
				}
			}
		}
		locate: {
			latitudeLabel: string
			longitudeLabel: string
			coordinatesLabel: string
			accuracyLabel: string
			lastUpdateLabel: string
			errorLabel: string

			tryAgain: string

			lastUpdate: (timestamp: TimestampMs) => string
			accuracyRadius: (meters: number, isLow: boolean) => string
			noPosition: (
				lastUpdate: TimestampMs,
				deltaTimeSeconds: number,
			) => string
			explainGeolocationErrorCode: (code: GeolocationErrorCode) => string
		}
		list: {
			noLocationsTitle: string
			noLocationsGoToMenu: string
			ordinalNumber: string
			name: string
			description: string
			date: string
			coordinates: string
			actions: {
				label: string
				view: string
				delete: string
			}
		}
		menu: {
			title: string
			locateMe: string
			addLocation: string
			showLocations: string
			featureDescription: string
		}
	}
	error: {
		unknown: string
	}
	shrine: {
		view: {
			navigation: {
				images: string
				comments: string
				map: string
			}
			createdAt: (date: Date) => string
			lastEditedAt: (date: Date) => string
			galleryHeader: string
			mapHeader: string
			commentsHeader: string
		}
	}
	map: {
		title: string
		description: string,
	}
}

const translations = new Map<Language, AppTranslation>()

translations.set(DEFAULT_LANGUAGE, AppTranslationPL)

export const TranslatorContext = createTranslatorContext<AppTranslation>(
	new Translator(translations),
)

const hooks = makeTranslationHooks(TranslatorContext)

export const useAppTranslation = hooks.useTranslation
export const useAppTranslationSelector = hooks.useTranslationSelector
export const useTranslator = hooks.useTranslator
