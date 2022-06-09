import React, { ReactFragment } from "react"
import styled from "styled-components"

const Wrapper = styled.nav`
    display: block;

    background-color: ${props => props.theme.primaryColor};
    height: 100px;
`

const NavBar = (props: { children?: ReactFragment }) => {
	return <Wrapper>{props.children}</Wrapper>
}

export default NavBar
