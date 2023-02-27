import { graphql } from "gatsby";
import React from "react";



import PageContainer from "@app/components/layout/PageContainer";
import { ShrinesGrid } from "@app/components/shrine/grid/ShrinesGrid";
import { convertShrineHeader } from "@app/domain/shrine";



import { asNonNullable } from "tws-common/typing/required";


const SearchPage = (props: { data: Queries.WaysideShrineSearchQuery }) => {
	const { data } = props

	const headers = data.allFile.nodes
		.filter(v => !!v)
		.map(v => convertShrineHeader(asNonNullable(v.childMarkdownRemark)))

	return (
		<PageContainer>
			<main>
				<ShrinesGrid shrines={headers} />
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
			sort: {
				fields: [childMarkdownRemark___frontmatter___createdAt]
				order: DESC
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