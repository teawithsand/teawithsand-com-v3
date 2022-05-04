import React from "react"
import {
	blogHomePath,
	contactPath,
	homePath,
	paintPath,
	portfolioPath,
} from "@app/components/paths"
import { Container, Nav, Navbar } from "react-bootstrap"

import * as styles from "./navbar.module.scss"
import LinkContainer from "@app/components/util/LinkContainer"

export default () => {
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container fluid={true}>
				<LinkContainer to={homePath}>
					<Navbar.Brand href="#">teawithsand.com</Navbar.Brand>
				</LinkContainer>

				<Navbar.Toggle />

				<Navbar.Collapse>
					<span className={styles.alignToEnd}></span>
					<Nav>
						<LinkContainer to={homePath}>
							<Nav.Link>Home</Nav.Link>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to={portfolioPath}>
							<Nav.Link>Portfolio</Nav.Link>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to={blogHomePath}>
							<Nav.Link>Blog</Nav.Link>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to={contactPath}>
							<Nav.Link>Contact</Nav.Link>
						</LinkContainer>
					</Nav>
					<Nav>
						<LinkContainer to={paintPath}>
							<Nav.Link>Paint</Nav.Link>
						</LinkContainer>
					</Nav>
					{/*
                <Nav>
                    <LinkContainer to={aboutMePath}>
                        <Nav.Link>
                            About me
                        </Nav.Link>
                    </LinkContainer>
                </Nav>
                */}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
