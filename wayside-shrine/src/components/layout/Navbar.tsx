import React from "react"

import {
	contactLink,
	homePath,
	listPath,
	locationAddPath,
	locationListPath,
	locationLocatePath,
	locationMenuPath,
	mapPath,
	publishingPath,
} from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Container, Nav, Navbar, NavDropdown } from "tws-common/ui"
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
						<LinkContainer to={listPath}>
							<Nav.Link href="#">{trans.list}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={mapPath}>
							<Nav.Link href="#">{trans.map}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={publishingPath}>
							<Nav.Link href="#">{trans.publishing}</Nav.Link>
						</LinkContainer>
						<LinkContainer to={contactLink}>
							<Nav.Link href="#">{trans.contact}</Nav.Link>
						</LinkContainer>
						<NavDropdown title={trans.location.title} align={"end"}>
							<LinkContainer to={locationMenuPath}>
								<NavDropdown.Item>
									{trans.location.menu}
								</NavDropdown.Item>
							</LinkContainer>
							<NavDropdown.Divider />
							<LinkContainer to={locationLocatePath}>
								<NavDropdown.Item>
									{trans.location.locateMe}
								</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to={locationAddPath}>
								<NavDropdown.Item>
									{trans.location.addLocation}
								</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to={locationListPath}>
								<NavDropdown.Item>
									{trans.location.showLocations}
								</NavDropdown.Item>
							</LinkContainer>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default AppNavbar
