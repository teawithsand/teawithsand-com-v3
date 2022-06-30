import PageContainer from "@app/components/layout/PageContainer"
import ShrineCard from "@app/components/shrine/ShrineCard"
import { graphql } from "gatsby"
import React from "react"
import styled from "styled-components"
import {
	asRequiredRecursively,
	RecursiveRequired,
} from "tws-common/typing/required"

import {
	useBreakpointIndex,
	breakpointIndex,
	BREAKPOINT_MD,
} from "tws-common/react/hook/dimensions/useBreakpoint"

const ShrineCardGrid = styled.div`
	display: grid;
	grid-template-columns: ${({ $smallDisplay }) =>
		$smallDisplay ? "1fr" : "repeat(3, 1fr)"};
	grid-auto-flow: row dense;
	gap: 1rem;
`

const SerachPage = (props: { data: Queries.WaysideShrineSearchQuery }) => {
	const { data } = props

	const isSmall = useBreakpointIndex() <= breakpointIndex(BREAKPOINT_MD)

	return (
		<PageContainer>
			<main>
				<ShrineCardGrid $smallDisplay={isSmall}>
					{data.allFile.nodes
						.map(v => asRequiredRecursively(v.childMarkdownRemark))
						.map(v => {
							const u = v as RecursiveRequired<typeof v>
							if (!u) throw new Error("unreachable code")
							return (
								<ShrineCard
									key={u.id}
									data={{
										title: u.frontmatter.title,
										createdDate: u.frontmatter.date,
										excerpt: u.excerpt,
										lastEditedDate: null,
										coordinates: u.frontmatter
											.coordinates as [number, number],
										path: u.fields.path,
										tags: [...u.frontmatter.tags],
										featuredImage:
											u.frontmatter.featuredImage
												.childImageSharp,
									}}
								/>
							)
						})}
				</ShrineCardGrid>
			</main>
		</PageContainer>
	)
}

export default SerachPage

export const pageQuery = graphql`
	query WaysideShrineSearch {
		allFile(
			filter: {
				sourceInstanceName: { eq: "waysideshrines" }
				name: { eq: "index" }
				extension: { eq: "md" }
			}
		) {
			nodes {
				childMarkdownRemark {
					id
					frontmatter {
						title
						date(formatString: "YYYY-MM-DD")
						coordinates
						tags
						featuredImage {
							childImageSharp {
								gatsbyImageData(layout: CONSTRAINED)
							}
						}
					}
					fields {
						path
					}
					excerpt(pruneLength: 160)
				}
			}
		}
	}
`
