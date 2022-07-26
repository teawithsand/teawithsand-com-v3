import { graphql } from "gatsby"
import React from "react"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"
import ShrineCard from "@app/components/shrine/ShrineCard"
import { convertShrineHeader } from "@app/domain/shrine"

import {
	BREAKPOINT_MD,
	breakpointMediaDown,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { asNonNullable } from "tws-common/typing/required"

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

	const headers = data.allFile.nodes
		.filter(v => !!v)
		.map(v => convertShrineHeader(asNonNullable(v.childMarkdownRemark)))

	return (
		<PageContainer>
			<main>
				<ShrineCardGrid>
					{headers.map((v, i) => {
						return <ShrineCard key={i} data={v} />
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
