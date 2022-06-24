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
	globalUi: {
		navbar: {
			abookLibraryDropdown: {
				title: "ABooks",
				addLocalABook: "Add ABook from local device",
				listABooks: "List ABooks",
				managementPanel: "ABook management panel",
			},
			localPlayer: "Play local files",
			pageTitle: "PalmABooks PWA",
			homePage: "Home",
		},
	},
}

export default AppTranslationEN
