import AppTranslation from "@app/trans/AppTranslation"

import { CommonTranslationPL_PL } from "tws-common/trans/common"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const AppTranslationPL: AppTranslation = {
	common: CommonTranslationPL_PL,
	appName: "SzlakiemKapliczek",
	layout: {
		navbar: {
			homePage: "Strona główna",
			search: "Wyszukiwanie",
			publishing: "Jak dodać obiekt?",
			brandName: "SzlakiemKapliczek",
			location: {
				title: "Lokalizacje",
				menu: "Menu lokalizacji",
				addLocation: "Dodaj lokalizację ręcznie",
				locateMe: "Zlokalizuj mnie przy użyciu GPS",
				showLocations: "Lista zapisanych lokalizacji",
			},
		},
	},
	location: {
		form: {
			nameLabel: "Nazwa",
			descriptionLabel: "Opis",
			latitudeLabel: "Szerokość geograficzna",
			longitudeLabel: "Długość geograficzna",
		},
		locate: {
			accuracyLabel: "Dokładność - promień",
			coordinatesLabel: "Koordynaty",
			lastUpdateLabel: "Ostatnia aktualizacja pozycji",
			latitudeLabel: "Szerokość geograficzna",
			longitudeLabel: "Długość geograficzna",
			errorLabel: "Błąd",
			noPosition: lastUpdateTimestamp =>
				`Brak lokalizacji. Ostatnia aktualizacja: ${new Date(
					lastUpdateTimestamp,
				).toLocaleString("pl-PL")}`,
			lastUpdate: timestamp =>
				new Date(timestamp).toLocaleString("pl-PL"),
			accuracyRadius: (meter, isLow) =>
				`${meter}m ${(isLow && "(niska)") || ""}`,
			explainGeolocationErrorCode: code => {
				switch (code) {
					case GeolocationErrorCode.NOT_SUPPORTED:
						return "Urządzenie nie wspiera lokalizacji"
					case GeolocationErrorCode.PERMISSION_DENIED:
						return "Brak uprawnień. Sprawdź czy nie odmówiłeś tej stronie dostępu do lokalizacji."
					case GeolocationErrorCode.POSITION_UNAVAILABLE:
						return "Pozycja nie jest dostępna"
					case GeolocationErrorCode.TIMEOUT:
						return "Czas na uzyskanie lokalizacji upłynął"
					default:
					case GeolocationErrorCode.UNKNOWN:
						return "Nieznany błąd dostępu do lokalizacji"
				}
			},
		},
		menu: {
			title: "Lokalizacja",
			addLocation: "Dodaj lokalizację ręcznie",
			locateMe: "Zlokalizuj mine",
			showLocations: "Lista zapisanych lokalizacji",
			featureDescription: `Lokalizator pozwala na pobranie lokalizacji z urządzenia i zapisanie jej w pamięci strony internetowej.
				Ułatwia to zapisanie lokalizacji objektu, który zostanie zgłoszony. Zapisane lokalizacje można wyeksportować do pliku.`,
		},
		list: {
			noLocationsTitle: "Nie masz żadnych zapisanych lokalizacji",
			noLocationsGoToMenu: "Idź do menu lokalizacji",
			name: "Lista lokalizacji",
			date: "Data",
			ordinalNumber: "Lp.",
			coordinates: "Współrzędne",
			description: "Opis",
			actions: {
				label: "Akcje",
				delete: "Usuń",
				view: "Podgląd",
			},
		},
	},
	error: {
		unknown: "Wystąpił nieznany błąd",
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
