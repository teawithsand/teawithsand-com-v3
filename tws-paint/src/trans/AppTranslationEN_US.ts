import AppTranslation from "@app/trans/AppTranslation"

import { CommonTranslationEN_US } from "tws-common/trans/common"

const AppTranslationEN_US: AppTranslation = {
	common: CommonTranslationEN_US,
	meta: {
		title: "TWS Paint",
		description:
			"Another vector/raster graphics paint. Created by teawithsand.",
		siteName: "Paint application of teawithsand.com",
		siteKeywords: ["paint", "teawithsand"],
		siteAddress: "https://paint.teawithsand.com",
	},
	error: {
		unknown: "An unknown error occurred",
	},
}

export default AppTranslationEN_US
