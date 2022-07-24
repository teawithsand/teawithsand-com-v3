import { graphql } from "gatsby";
import React from "react";
import styled from "styled-components";



import PageContainer from "@app/components/layout/PageContainer";
import ShrineCard from "@app/components/shrine/ShrineCard";



import { BREAKPOINT_MD, breakpointMediaDown } from "tws-common/react/hook/dimensions/useBreakpoint";
import { asRequiredRecursively, RecursiveRequired } from "tws-common/typing/required";


const ShrineCardGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		grid-template-columns: 1fr;
	}
	grid-auto-flow: row dense;
	gap: 1rem;
`

const SearchPage = (props: { data: Queries.WaysideShrineSearchQuery }) => {
	const { data } = props

	return (
		<PageContainer>
			<main>
				<ShrineCardGrid>
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
										featuredImage: u.frontmatter
											.featuredImage
											.childImageSharp as any,
									}}
								/>
							)
						})}
				</ShrineCardGrid>
			</main>
		</PageContainer>
	)
}

export default SearchPage

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
					...ShrineHeader
				}
			}
		}
	}
`