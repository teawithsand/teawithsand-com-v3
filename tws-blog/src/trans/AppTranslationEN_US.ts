import AppTranslation from "@app/trans/AppTranslation"

import { CommonTranslationEN_US } from "tws-common/trans/common"

const AppTranslationEN_US: AppTranslation = {
	common: CommonTranslationEN_US,
	title: "Teawithsand's blog",
	description: "Teawithsand's personal blog about programming and other stuff, but mostly programming",
	info: {
		twitter: "teawithsand",
	},
	layout: {
		navbar: {
			blogPostList: "Posts",
			appList: "Apps",
			tagList: "Tags",
			brandName: "TWS's blog",
			facebook: "Facebook",
			github: "GitHub",
			linkedin: "LinkedIn",
			twitter: "Twitter",
		},
	},
}

export default AppTranslationEN_US
