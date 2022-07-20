import React from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import styled from "styled-components"
import { Container } from "tws-common/ui"
import { appsPath, blogPostsPath, homePath, tagsPath } from "@app/paths"
import { graphql, Link, useStaticQuery } from "gatsby"

const ParentContainer = styled.nav`
	margin-top: 1.5rem;
    margin-bottom: 1.5rem;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
	display: grid;
	color: rgba(0, 0, 0, 0.5);
    font-size: 2rem;
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
