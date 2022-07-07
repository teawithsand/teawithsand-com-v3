import React from "react"

import { homePath, locationPath, publishingPath, searchPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Container, Nav, Navbar } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const AppNavbar = () => {
	const trans = useAppTranslationSelector(s => s.layout.navbar)
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container>
				<LinkContainer to={homePath}>
					<Navbar.Brand>{trans.brandName}</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle />
				<Navbar.Collapse>
					<Nav className="ms-auto">
						<LinkContainer to={searchPath}>
							<Nav.Link href="#">{trans.search}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={publishingPath}>
							<Nav.Link href="#">{trans.publishing}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={locationPath}>
							<Nav.Link href="#">{trans.location}</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default AppNavbar
