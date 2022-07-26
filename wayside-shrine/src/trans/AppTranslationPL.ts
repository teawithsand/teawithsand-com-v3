import AppTranslation from "@app/trans/AppTranslation"

import { CommonTranslationPL_PL } from "tws-common/trans/common"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const AppTranslationPL: AppTranslation = {
	common: CommonTranslationPL_PL,
	appName: "SzlakiemKapliczek",
	meta: {
		title: "Szlakiem Kapliczek",
		description:
			"Portal szlakiemkapliczek.pl zbiera zdjęcia kapliczek nadesłane przez użytkowników. Pozwala także je przeglądać i wyszukiwać.",
	},
	layout: {
		navbar: {
			homePage: "Strona główna",
			list: "Lista kapliczek",
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
		display: {
			latitude: v => `Szerokość geograficzna ${v}`,
			longitude: v => `Długość geograficzna ${v}`,
			noDescription: "Brak opisu",
			noName: "Brak nazwy",
			deleteLabel: "Usuń",
			editLabel: "Edytuj",
		},
		form: {
			nameLabel: "Nazwa",
			descriptionLabel: "Opis",
			latitudeLabel: "Szerokość geograficzna",
			longitudeLabel: "Długość geograficzna",
			validation: {
				name: {
					notEmpty: "Nazwa nie może być pusta",
				},
				latitude: {
					notEmpty: "Szerokość geograficzna nie może być pusta",
					invalid:
						"Szerokość geograficzna musi być liczbą z zakresu od -90 do 90",
				},
				longitude: {
					invalid:
						"Długość geograficzna musi być liczbą z zakresu od -180 do 180",
					notEmpty: "Długość geograficzna nie może być pusta",
				},
			},
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
			tryAgain: "Spróbuj ponownie",
		},
		menu: {
			title: "Lokalizacja",
			addLocation: "Dodaj lokalizację ręcznie",
			locateMe: "Zlokalizuj mine",
			showLocations: "Lista zapisanych lokalizacji",
			featureDescription: `Lokalizator pozwala na pobranie lokalizacji z urządzenia i zapisanie jej w pamięci strony internetowej.
				Ułatwia to zapisanie lokalizacji obiektu, który zostanie zgłoszony. Zapisane lokalizacje można wyeksportować do pliku.`,
		},
		list: {
			noLocationsTitle: "Nie masz żadnych zapisanych lokalizacji",
			noLocationsGoToMenu: "Idź do menu lokalizacji",
			name: "Nazwa lokalizacji",
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
	map: {
		title: "Mapa",
		description:
			"Mapa zawiera wszystkie obiekty. Można na nie kliknąć aby przejść do strony danego obiektu.",
	},
}

export default AppTranslationPL
