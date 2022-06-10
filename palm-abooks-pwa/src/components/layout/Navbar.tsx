import React from "react"
import { Container, Nav, Navbar as Bar } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

import styled from "styled-components"

const ToEndPaginator = styled.span`
	margin-left: auto;
`

const Navbar = () => {
	return (
		<Bar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container fluid={true}>
				<LinkContainer to={"/"}>
					<Bar.Brand href="#">palmabooks.com</Bar.Brand>
				</LinkContainer>

				<Bar.Toggle />

				<Bar.Collapse>
					<ToEndPaginator></ToEndPaginator>
					<Nav>
						<LinkContainer to={"/"}>
							<Nav.Link>Home</Nav.Link>
						</LinkContainer>
					</Nav>
				</Bar.Collapse>
			</Container>
		</Bar>
	)
}

export default Navbar
