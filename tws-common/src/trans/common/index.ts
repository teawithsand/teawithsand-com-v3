import { TimestampMs } from "tws-common/lang/time/Timestamp"

export type TranslatableDate = Date | TimestampMs | string

export const translatableDateToDate = (date: TranslatableDate) => {
	if (date instanceof Date) return date
	return new Date(date)
}

/**
 * Predefined set of translations, which is commonly used so was migrated to tws-common.
 */
export interface CommonTranslation {
	// language in format like en-US or en-GB
	language: {
		twoPartCode: string
		singlePartCode: string
		languageName: string
	}

	// Date only
	formatDate: (date: TranslatableDate) => string
	// Date + Time
	formatDateTime: (date: TranslatableDate) => string
	// Time only
	formatTime: (date: TranslatableDate) => string

	dialog: {
		areYouSure: {
			defaultTitle: string
			defaultMessage: string
			defaultConfirmLabel: string
			defaultCancelLabel: string

			messageDelete: string
		}
	}

	form: {
		submitLabel: string
		resetLabel: string
	}
}

export const makeCommonTranslationTemplate = (
	language: CommonTranslation["language"],
) => ({
	language,
	formatDate: (date: TranslatableDate) =>
		translatableDateToDate(date).toLocaleDateString(language.twoPartCode),
	formatDateTime: (date: TranslatableDate) =>
		translatableDateToDate(date).toLocaleString(language.twoPartCode),
	formatTime: (date: TranslatableDate) =>
		translatableDateToDate(date).toLocaleTimeString(language.twoPartCode),
})

export * from "./en-us"
export * from "./pl-pl"
