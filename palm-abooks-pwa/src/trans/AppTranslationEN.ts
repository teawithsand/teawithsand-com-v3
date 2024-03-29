import AppTranslation from "@app/trans/AppTranslation"
import { CommonTranslationEN_US } from "tws-common/trans/common"

const AppTranslationEN_US: AppTranslation = {
	common: CommonTranslationEN_US,
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
		pickLocalFilesModal: {
			title: "Play files from local computer",
			fileFieldLabel: "Files to play(you can drag and drop them)",
		},
		optionsBar: {
			speed: "Speed",
		},
	},
	library: {
		abook: {
			flash: {
				abookFileRemoveSuccessFlash: (abookName, fileName) =>
					`Successfully removed file: "${fileName}" from ABook: "${abookName}"`,
				abookRemoveSuccessFlash: abookName =>
					`Successfully deleted ABook: "${abookName}"`,
				abookFileReorderSuccessFlash: abookName =>
					`Successfully reordered files in ABook: ${abookName}`,
			},
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
			playerDropdown: {
				title: "Player",
				playLocal: "Play files form this computer",
				showPlayerUi: "Show player UI",
			},
			pageTitle: "PalmABooks PWA",
			homePage: "Home",
		},
	},
	oldCommon: {
		sureModal: {
			defaultTitle: `Are you sure?`,
			defaultDescription: `This operation requires confirmation.`,
			confirm: `Proceed`,
			cancel: `Cancel`,
		},
	},
}

export default AppTranslationEN_US
