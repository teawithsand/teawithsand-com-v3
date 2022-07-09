import AppTranslation from "@app/trans/AppTranslation"

import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const AppTranslationPL: AppTranslation = {
	appName: "SzlakiemKapliczek",
	layout: {
		navbar: {
			homePage: "Strona główna",
			search: "Wyszukiwanie",
			publishing: "Jak dodać obiekt?",
			brandName: "SzlakiemKapliczek",
			location: "Zlokalizuj mnie",
		},
	},
	location: {
		display: {
			accuracyLabel: "Dokładność",
			coordinatesLabel: "Koordynaty",
			lastUpdateLabel: "Ostatnia aktualizacja pozycji",
			latitudeLabel: "Szerokość geograficzna",
			longitudeLabel: "Długość geograficzna",
			noPosition: lastUpdateTimestamp =>
				`Brak lokalizacji. Ostatnia aktualizacja: ${new Date(
					lastUpdateTimestamp,
				).toLocaleString("pl-PL")}`,
			lastUpdate: timestamp =>
				new Date(timestamp).toLocaleString("pl-PL"),
			accuracyRadius: (meter, isLow) =>
				`Dokładność(promień) ${meter}m ${isLow && "(niska)"}`,
			explainGeolocationErrorCode: code => {
				switch (code) {
					case GeolocationErrorCode.NOT_SUPPORTED:
						return "Urządzenie nie wspiera lokalizacji"
					case GeolocationErrorCode.PERMISSION_DENIED:
						return "Brak uprawnień. Sprawdź czy nie odmówiłeś tej stronie dostępu do lokalizacji."
					case GeolocationErrorCode.POSITION_UNAVAILABLE:
						return "Pozycja nie jest dostępna"
					case GeolocationErrorCode.TIMEOUT:
						return "Czas na dostęp do lokalizacji upłyną"
					default:
					case GeolocationErrorCode.UNKNOWN:
						return "Nieznany błąd dostępu do lokalizacji"
				}
			},
		},
	},
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
