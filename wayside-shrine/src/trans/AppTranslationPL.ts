import AppTranslation from "@app/trans/AppTranslation"

const AppTranslationPL: AppTranslation = {
	appName: "SzlakiemKapliczek",
	shrine: {
		view: {
			galleryHeader: "Galeria",
			mapHeader: "Mapa",
			commentsHeader: "Komentarze",
			createdAt: (date: Date) =>
				`Opublikowano: ${date.toLocaleDateString("pl-PL")}`,
			lastEditedAt: (date: Date) =>
				`Ostatnia aktualizacja: ${date.toLocaleDateString("pl-PL")}`,
			navigation: {
				comments: "Komentarze",
				images: "Zdjęcia",
				map: "Mapa",
			},
		},
	},
}

export default AppTranslationPL
