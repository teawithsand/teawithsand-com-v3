import AppTranslation from "@app/trans/AppTranslation"

import { CommonTranslationEN_US } from "tws-common/trans/common"

const AppTranslationEN_US: AppTranslation = {
	common: CommonTranslationEN_US,
	title: "Teawithsand's blog",
	description:
		"Teawithsand's personal blog about programming and other stuff, but mostly programming",
	info: {
		twitter: "teawithsand",
		github: "teawithsand",
		linkedIn: "przemyslaw-glowacki-d2f37f2e",
		email: "contact@przemyslawglowacki.pl",
	},
	contact: {
		title: "Contact me",
		text: `You can contact me in various ways, but I prefer email. Below is list of social media accounts that I have along with my email:`,
		twitter: "Twitter",
		email: "Email",
		facebook: "Facebook",
		github: "Github",
		linkedIn: "LinkedIn",
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
			contact: "Contact",
		},
	},
}

export default AppTranslationEN_US
