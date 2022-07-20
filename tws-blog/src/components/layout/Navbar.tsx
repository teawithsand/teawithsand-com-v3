import React from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import styled from "styled-components"
import { Container } from "tws-common/ui"
import { appsPath, blogPostsPath, homePath, tagsPath } from "@app/paths"
import { graphql, Link, useStaticQuery } from "gatsby"

const ParentContainer = styled.nav`
	display: grid;
	grid-template-rows: auto auto;
	grid-template-columns: auto;
	gap: 0.8rem;

	border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	padding-bottom: .3rem;
`

const HeadingRow = styled.header`
	grid-column: 1;
	grid-row: 1;

	font-size: 2rem;
	font-weight: 400;

	display: flex;
	flex-flow: row wrap;
	gap: 1rem;
`

const LinksRow = styled.div`
	grid-column: 1;
	grid-row: 2;

	display: flex;
	flex-flow: row wrap;
	gap: 1rem;

	font-size: 1.2rem;
`

const InvisibleLink = styled(Link)`
	text-decoration: none;
	color: initial;
`

const Spacer = styled.span`
	margin-left: auto;
`

const AppNavbar = () => {
	const trans = useAppTranslationSelector(s => s.layout.navbar)
	const res: any = useStaticQuery(graphql`
		query NavbarQuery {
			site {
				siteMetadata {
					twitter
				}
			}
		}
	`)
	return (
		<Container>
			<ParentContainer>
				<HeadingRow>
					<InvisibleLink to={homePath}>
						{trans.brandName}
					</InvisibleLink>
				</HeadingRow>
				<LinksRow>
					<InvisibleLink to={blogPostsPath}>
						{trans.blogPostList}
					</InvisibleLink>
					<InvisibleLink to={tagsPath}>{trans.tagList}</InvisibleLink>
					<InvisibleLink to={appsPath}>{trans.appList}</InvisibleLink>
					<InvisibleLink
						to={res.site.siteMetadata.twitter}
						rel="noopener noreferrer"
					>
						{trans.twitter}
					</InvisibleLink>
				</LinksRow>
			</ParentContainer>
		</Container>
	)
}

export default AppNavbar
