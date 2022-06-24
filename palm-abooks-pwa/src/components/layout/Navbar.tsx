import React from "react"
import styled from "styled-components"

import {
	libraryABookIndex,
	libraryAddABookFromLocalFSPath,
	libraryListABookPath,
	localPlayerPath,
} from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Navbar as Bar, Container, Nav, NavDropdown } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const ToEndPaginator = styled.span`
	margin-left: auto;
`

const Navbar = () => {
	const translations = useAppTranslationSelector(s => s.globalUi.navbar)
	return (
		<Bar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container fluid={true}>
				<LinkContainer to={"/"}>
					<Bar.Brand href="#">{translations.pageTitle}</Bar.Brand>
				</LinkContainer>

				<Bar.Toggle />

				<Bar.Collapse>
					<ToEndPaginator></ToEndPaginator>
					<Nav>
						<LinkContainer to={"/"}>
							<Nav.Link>{translations.homePage}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={localPlayerPath}>
							<Nav.Link>{translations.localPlayer}</Nav.Link>
						</LinkContainer>

						<NavDropdown
							title={translations.abookLibraryDropdown.title}
							align={"end"}
						>
							<LinkContainer to={libraryABookIndex}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.managementPanel
									}
								</NavDropdown.Item>
							</LinkContainer>
							<NavDropdown.Divider />
							<LinkContainer to={libraryAddABookFromLocalFSPath}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.addLocalABook
									}
								</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to={libraryListABookPath}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.listABooks
									}
								</NavDropdown.Item>
							</LinkContainer>
						</NavDropdown>
					</Nav>
				</Bar.Collapse>
			</Container>
		</Bar>
	)
}

export default Navbar
