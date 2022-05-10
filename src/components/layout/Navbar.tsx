import React from "react"
import { Navbar as Bar, Container, Nav } from "react-bootstrap"

import {
	blogHomePath,
	contactPath,
	homePath,
	paintPath,
	portfolioPath,
} from "@app/components/paths"
import LinkContainer from "@app/components/util/LinkContainer"

import * as styles from "./navbar.module.scss"

const Navbar = () => {
	return (
		<Bar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container fluid={true}>
				<LinkContainer to={homePath}>
					<Bar.Brand href="#">teawithsand.com</Bar.Brand>
				</LinkContainer>

				<Bar.Toggle />

				<Bar.Collapse>
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
				</Bar.Collapse>
			</Container>
		</Bar>
	)
}

export default Navbar
