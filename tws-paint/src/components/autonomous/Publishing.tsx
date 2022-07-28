import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import styled from "styled-components"

import { Card } from "tws-common/ui"

type Info = {
	submissionsEmail: string
}

const Lines = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
	list-style-type: none;
`

const PublishingPL = (props: Info) => {
	return (
		<section>
			<header>
				<h1>Jak dodać nowy obiekt?</h1>
			</header>
			<h2>Szybkie skróty</h2>
			<ul>
				<li>
					Adres do nadsyłania zgłoszeń:{" "}
					<a href={`mailto:${props.submissionsEmail}`}>
						{props.submissionsEmail}
					</a>
				</li>
				<li>
					<a
						rel="noopener noreferrer"
						href="https://creativecommons.org/publicdomain/zero/1.0/legalcode.pl"
					>
						Link do CC-0{" "}
					</a>
				</li>
				<li>
					<a
						rel="noopener noreferrer"
						href="https://creativecommons.org/licenses/by/4.0/legalcode.pl"
					>
						Link do CC-BY{" "}
					</a>
				</li>
				<li>
					<a href="#">Strona kontaktu</a>
				</li>
			</ul>
			<p>
				Portal SzlakiemKapliczek zbiera dane na temat różnych
				obiektów(ale głównie kapliczek oraz krzyży przydrożnych) w
				Polsce i na świecie.
			</p>
			<p>
				Biorąc pod uwagę, że kliknąłeś ten link zakładam, że chcesz
				dodać takowy na tej stronie.
			</p>
			<p>
				Początkowo(2016 - 2018 rok) portal, wówczas pod inną nazwą,
				pozwalał na bezpośrednie publikowanie treści na stronie poprzez
				odpowiedni formularz. Ze względu na dużą ilość botów oraz trolli
				oraz ataków DoS postanowiłem zdjąć tamten projekt z internetu.
			</p>
			<h2>Jak przygotować zgłoszenie?</h2>
			TL;DR nagrałem o tym video na YT: <a href="#">tutaj</a>. W skrócie:
			<ul>
				<li>
					Zgromadź/zdobądź/stwórz/zrób:
					<ul>
						<li>
							Lokalizację(najlepiej współrzędne, ewentualnie
							adres, który będę mógł zamienić na współrzędne).
							Lokalizacja może być też dołączona w metadanych
							zdjęć, jeżeli jej dokładność jest dostateczna.
						</li>
						<li>Zdjęcia</li>
						<li>Opcjonalnie: opis obiektu</li>
					</ul>
				</li>
				<li>
					<em>
						Uzasadnienie dlaczego tak znajduje się w filmie powyżej
					</em>
					<br />
					Opublikuj ww. dane na licencji{" "}
					<a href="https://creativecommons.pl/poznaj-licencje-creative-commons/">
						Creative Commons
					</a>{" "}
					<a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode.pl">
						<b>CC-0, która jest preferowaną licencją</b>
					</a>{" "}
					lub{" "}
					<a href="https://creativecommons.org/licenses/by/4.0/legalcode.pl">
						CC-BY
					</a>{" "}
					a następnie wysłać na{" "}
					<a href={`mailto:${props.submissionsEmail}`}>
						adres do zgłoszeń
					</a>
					. Wpis w mailu, który informuje o tym że treść jest
					udostępniona na jednej z tych licencji jest wystarczający.
				</li>
				<li>
					Wyślij zgłoszenie na{" "}
					<a href={`mailto: ${props.submissionsEmail}`}>
						{props.submissionsEmail}
					</a>{" "}
					W mailu możesz załączyć link do danych źródłowych lub(co
					jest preferowane) załączyć zdjęcia oraz dane wraz z tekstem
					licencji, na której są one udostępnione.
				</li>
				<li>
					Mail/źródło powinno zawierać podstawową informację o autorze
					tj. jego imię i nazwisko lub pseudonim, tak abym mógł
					dołączyć dane autora w opisie obiektu.
				</li>
				<li>
					Jeśli osoba wysyłająca maila jest autorem treści zawartych w
					mailu takich jak zdjęcia czy opis, to powinno być to opisane
					w mailu w sposób niebudzący wątpliwości co do tego, kto jest
					autorem danego zdjęcia/opisu/innej treści. Podobnie jeśli
					nie jest, ale treści są udostępnione na kompatybilnej
					licencji.
				</li>
				<li>
					Opis(jeżeli jest dołączony):
					<ul>
						<li>
							Powinien być plikiem <b>.txt</b> lub <b>.md</b>,
							ponieważ te formaty jest łatwo zaadaptować na
							potrzeby strony internetowej. Pliki np. worda czy
							libre office należałoby przepisać na jeden z tych
							formatów, co zwyczajnie zabiera czas i utrudnia mi
							życie, więc nie będę tego robić.
						</li>
						<li>
							<em>Disclaimer: nie testowałem tego rozwiązania</em>
							<br />
							Można skorzystać z konwerterów online np.{" "}
							<a
								href="https://word2md.com/"
								rel="noopener noreferrer"
								target="_blank"
							>
								https://word2md.com
							</a>
							, które zamieniają pliki worda na pliki .md lepiej
							lub gorzej.
						</li>
					</ul>
				</li>
				<li>
					Zdjęcia:
					<ul>
						<li>
							Nie powinny zawierać ludzi(tj. dowolnych części
							ciała człowieka)
						</li>
						<li>
							Nie mogą być opatrzone znakiem wodnym(ewentualne
							należy się kontaktować ze mną). Przede wszystkim
							należy wyłączyć funkcję oznaczania daty lub dostawcy
							aparatu bezpośrednio na zdjęciu.
						</li>
						<li>
							Nie powinny zawierać żadnych zbędnych obiektów m.in:
							<ul>
								<li>rowerów</li>
								<li>samochodów</li>
								<li>tablic rejestracyjnych(sic!)</li>
								<li>pozostawionych felg(sic!)</li>
								<li>symboli nazistowskich(sic!)</li>
								<li>
									puszek, paczek, butelek i innych
									śmieci(sic!)
								</li>
							</ul>
						</li>
						<li>
							Powinny być przyzwoitej jakości, tak aby osoby je
							oglądające musiały walczyć z bólem głowy wywołanym
							przez oglądanie nieostrych zdjęć, na których i tak
							widać tylko słońce i cień fotografowanej kapliczki.
							Współczesne telefony pozwalają na robienie bardzo
							dobrych zdjęć w wysokiej rozdzielczości minimalnym
							nakładem pracy i umiejętności.
						</li>
						<li>Nie powinny mieć nałożonych żadnych filtrów</li>
					</ul>
				</li>
				<li>
					Pozostałe pytania można zadać poprzez maila{" "}
					<a href="#">do kontaktu</a>. Inne sposoby kontaktu ze mną są{" "}
					<a href="#">tutaj</a>.
				</li>
			</ul>
			<p>
				Przykładowy e-mail:
				<br />
				<br />
				<Card>
					<Card.Body>
						<Lines>
							<li>
								Od:
								czcigodny.uzytkownik@dostawcamaila.domenapoziomunajwyzszego
							</li>
							<li>
								Do:{" "}
								<a href={`mailto: ${props.submissionsEmail}`}>
									{props.submissionsEmail}
								</a>
							</li>
							<li>
								Temat: Zgłoszenie nowej kapliczki/innego cosia
							</li>
						</Lines>
						<hr />
						<p>
							Szanowny oraz cny administratorze serwisu
							szlakimekapliczek.pl, któremu chce się prowadzić,
							utrzymywać ten serwis, oraz dodawać nowe treści i
							zarządzać już istniejącymi,
						</p>
						<p>
							znalazłem taką oto kapliczkę/krzyż/coś innego i
							chciałbym aby zostało opublikowanie w serwisie.
						</p>
						<p>
							Lokalizacja:{" "}
							<em>
								*Tu współrzędne, które można namierzyć przy
								pomocy <a href="#">tej strony</a> lub adres,
								który będę mógł zamienić na współrzędne*
							</em>
						</p>
						<p>
							Wszystkie załączone zdjęcia jak i opis zostały
							stworzone przeze mnie(lub kogoś innego, wtedy opisać
							która część powinna być przypisana do konkretnej
							osoby).
						</p>
						<p>
							Wszystkie załączone zdjęcia jak i opis udostępnione
							są na licencji w pliku LICENSE.txt / załączonej
							poniżej / dostępnej pod adresem.
						</p>
						<p>
							<em>
								*Tu skopiowany tekst licencji w języku
								polskim(lub nie, jeśli jest w załączniku)*
							</em>
						</p>
						<p>
							Z wyrazami szacunku
							<br />
							Zacny, zbożny i moralny użytkownik internetu, który
							nie jest obojętny i chce pomóc w rozwoju tego
							serwisu <br />
							Jan Kowalski(lub pseudonim do publikacji)
						</p>

						<h6>Załączniki:</h6>
						<ul>
							<li>LICENSE.txt(lub tekst w mailu)</li>
							<li>Zdjęcie 1.jpg</li>
							<li>Zdjęcie 2.png</li>
							<li>Zdjęcie 3.gif</li>
							<li>Zdjęcie 4.webp</li>
							<li>Zdjęcie 5.avif</li>
							<li>
								Zdjęcie 6.jpeg<s>.exe</s>
							</li>
							<li>Opis.txt / Opis.md</li>
						</ul>
					</Card.Body>
				</Card>
			</p>
			<footer></footer>
		</section>
	)
}

const Publishing = () => {
	const data: any = useStaticQuery(graphql`
		query PublishingInfoQuery {
			site {
				siteMetadata {
					submissionsEmail
				}
			}
		}
	`)

	return (
		<PublishingPL
			submissionsEmail={data.site.siteMetadata.submissionsEmail}
		/>
	)
}

export default Publishing
