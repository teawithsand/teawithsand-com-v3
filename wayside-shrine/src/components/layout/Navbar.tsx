import React from "react"

import { Container, Nav, Navbar } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

import { homePath } from "@app/paths"

const AppNavbar = () => {
	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<LinkContainer to={homePath}>
					<Navbar.Brand>SzlakiemKapliczek</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<LinkContainer to="/">
							<Nav.Link href="#">Strona główna</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/map">
							<Nav.Link href="#">Mapa</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/search">
							<Nav.Link href="#">Wyszukiwanie</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default AppNavbar
