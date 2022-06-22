import AppTranslation from "@app/trans/AppTranslation"

const AppTranslationEN: AppTranslation = {
	appName: "PalmABooks PWA",
	generic: {
		modalClose: "Close",
	},
	player: {
		speedModal: {
			currentSpeed: speed => `${speed}x`,
			title: "Set speed",
			preservePitch: "Preserve pitch",
		},
		optionsBar: {
			speed: "Speed",
		},
	},
}

export default AppTranslationEN
