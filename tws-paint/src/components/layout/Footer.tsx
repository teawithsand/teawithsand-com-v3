import React from "react"
import styled from "styled-components"

import {
	BREAKPOINT_SM,
	breakpointMediaDown,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { Container } from "tws-common/ui"

const ParentContainer = styled.nav`
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
	display: grid;
	color: rgba(0, 0, 0, 0.5);
	font-size: 1rem;

	text-align: right;

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		text-align: center;
	}
`

const Footer = () => {
	return (
		<Container>
			<ParentContainer>
				<span>
					Strona stworzona i utrzymywana przez <a href="https://teawithsand.com">Teawithsand</a> - 2022
				</span>
			</ParentContainer>
		</Container>
	)
}

export default Footer
