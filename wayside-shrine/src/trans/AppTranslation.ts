import AppTranslationPL from "@app/trans/AppTranslationPL"

import { TimestampMs } from "tws-common/lang/time/Timestamp"
import { DEFAULT_LANGUAGE } from "tws-common/trans/language"
import Translator, {
	createTranslatorContext,
	useTranslator,
} from "tws-common/trans/Translator"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

export default interface AppTranslation {
	appName: string
	layout: {
		navbar: {
			search: string
			publishing: string
			homePage: string
			brandName: string
			location: string
		}
	}
	location: {
		display: {
			latitudeLabel: string
			longitudeLabel: string
			coordinatesLabel: string
			accuracyLabel: string
			lastUpdateLabel: string

			lastUpdate: (timestamp: TimestampMs) => string
			accuracyRadius: (meters: number, isLow: boolean) => string
			noPosition: (
				lastUpdate: TimestampMs,
				deltaTimeSeconds: number,
			) => string
			explainGeolocationErrorCode: (code: GeolocationErrorCode) => string
		}
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
