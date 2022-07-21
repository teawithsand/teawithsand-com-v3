import React from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import { Container } from "tws-common/ui"
import { breakpointMediaDown, BREAKPOINT_SM } from "tws-common/react/hook/dimensions/useBreakpoint"

const ParentContainer = styled.nav`
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
	display: grid;
	color: rgba(0, 0, 0, 0.5);
	font-size: 2rem;

	text-align: right;

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		text-align: center;
	}
`

const Footer = () => {
	const trans = useAppTranslationSelector(s => s.layout.navbar)
	const res: any = useStaticQuery(graphql`
		query FooterQuery {
			site {
				siteMetadata {
					twitter
				}
			}
		}
	`)
	return (
		<Container>
			<ParentContainer>© teawithsand 2022</ParentContainer>
		</Container>
	)
}

export default Footer
