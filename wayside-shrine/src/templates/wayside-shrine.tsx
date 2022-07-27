import * as React from "react"
import { graphql } from "gatsby"

import PageContainer from "@app/components/layout/PageContainer"
import { ShrineViewPage } from "@app/components/shrine/view/ShrineViewPage"
import { convertShrine } from "@app/domain/shrine"

import { asNonNullable } from "tws-common/typing/required"

const WaysideShrineTemplate = (props: {
	data: Queries.WaysideShrineShowQuery
}) => {
	return (
		<PageContainer>
			<main>
				<ShrineViewPage
					data={convertShrine(
						asNonNullable(props.data.current?.childMarkdownRemark),
					)}
				/>
			</main>
		</PageContainer>
	)
}

export default WaysideShrineTemplate

export const pageQuery = graphql`
	query WaysideShrineShow(
		$id: String!
		$previousShrineId: String
		$nextShrineId: String
	) {
		current: file(id: { eq: $id }) {
			childMarkdownRemark {
				...Shrine
			}
		}
		previous: file(id: { eq: $previousShrineId }) {
			childMarkdownRemark {
				...ShrineReference
			}
		}
		next: file(id: { eq: $nextShrineId }) {
			childMarkdownRemark {
				...ShrineReference
			}
		}
	}
`
