import {
	CommonTranslation,
	makeCommonTranslationTemplate,
} from "tws-common/trans/common"

export const CommonTranslationEN_US: CommonTranslation = {
	...makeCommonTranslationTemplate({
		languageName: "English (United States)",
		singlePartCode: "en",
		twoPartCode: "en-US",
	}),
	dialog: {
		areYouSure: {
			defaultCancelLabel: "Cancel",
			defaultConfirmLabel: "Confirm",
			defaultMessage: "Are you sure you want to proceed?",
			defaultTitle: "Confirm selected action",
			messageDelete: "Are you sure you want to delete specified element?",
		},
	},
}
