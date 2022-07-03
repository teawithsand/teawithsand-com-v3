import * as React from "react"
import { graphql } from "gatsby"

const WaysideShrineTemplate = (props: {
	data: Queries.WaysideShrineShowQuery
}) => {
	return <>{JSON.stringify(props.data)}</>
}

export default WaysideShrineTemplate

export const pageQuery = graphql`
	query WaysideShrineShow(
		$id: String!
		$previousShrineId: String
		$nextShrineId: String
	) {
		file(id: { eq: $id }) {
			childMarkdownRemark {
				id
				html
				frontmatter {
					title
					date(formatString: "MMMM DD, YYYY")
					tags
				}
			}
		}
		previous: file(id: { eq: $previousShrineId }) {
			childMarkdownRemark {
				frontmatter {
					tags
					title
					date(formatString: "MMMM DD, YYYY")
				}
				fields {
					path
				}
			}
		}
		next: file(id: { eq: $nextShrineId }) {
			childMarkdownRemark {
				frontmatter {
					tags
					title
					date(formatString: "MMMM DD, YYYY")
				}
				fields {
					path
				}
			}
		}
	}
`
