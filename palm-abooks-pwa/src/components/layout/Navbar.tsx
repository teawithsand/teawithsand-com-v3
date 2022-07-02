import { navigate } from "gatsby"
import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { playerUiSetShownModal } from "@app/domain/redux/playerUi"
import {
	abookLibraryAddFromLocalFSPath,
	abookLibraryIndexPath,
	abookLibraryListPath,
	playerLocalPath,
} from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Navbar as Bar, Container, Nav, NavDropdown } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const ToEndPaginator = styled.span`
	margin-left: auto;
`

const Navbar = () => {
	const translations = useAppTranslationSelector(s => s.globalUi.navbar)

	const dispatch = useDispatch()

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

						<NavDropdown
							title={translations.abookLibraryDropdown.title}
							align={"end"}
						>
							<LinkContainer to={abookLibraryIndexPath}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.managementPanel
									}
								</NavDropdown.Item>
							</LinkContainer>
							<NavDropdown.Divider />
							<LinkContainer to={abookLibraryAddFromLocalFSPath}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.addLocalABook
									}
								</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to={abookLibraryListPath}>
								<NavDropdown.Item>
									{
										translations.abookLibraryDropdown
											.listABooks
									}
								</NavDropdown.Item>
							</LinkContainer>
						</NavDropdown>

						<NavDropdown
							title={translations.playerDropdown.title}
							align={"end"}
						>
							<LinkContainer to={playerLocalPath}>
								<NavDropdown.Item>
									{translations.playerDropdown.showPlayerUi}
								</NavDropdown.Item>
							</LinkContainer>
							
							<NavDropdown.Item
								onClick={() => {
									dispatch(
										playerUiSetShownModal(
											"pick-local-files",
										),
									)
									navigate(playerLocalPath)
								}}
							>
								{translations.playerDropdown.playLocal}
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Bar.Collapse>
			</Container>
		</Bar>
	)
}

export default Navbar
