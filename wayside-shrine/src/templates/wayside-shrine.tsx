import * as React from "react"
import { graphql } from "gatsby"

import PageContainer from "@app/components/layout/PageContainer"
import ShrineView from "@app/components/shrine/view/ShrineView"

const WaysideShrineTemplate = (props: {
	data: Queries.WaysideShrineShowQuery
}) => {
	const u = props.data.current.childMarkdownRemark

	return (
		<PageContainer>
			<main>
				<ShrineView
					data={{
						title: u.frontmatter.title,
						createdDate: u.frontmatter.date,
						excerpt: u.excerpt,
						lastEditedDate: null,
						coordinates: u.frontmatter.coordinates as [
							number,
							number,
						],
						path: u.fields.path,
						tags: [...u.frontmatter.tags],
						html: u.html,
						images: u.frontmatter.galleryImages ?? [],
					}}
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
				frontmatter {
					title
					date(formatString: "YYYY-MM-DD")
					coordinates
					tags
					featuredImage {
						childImageSharp {
							gatsbyImageData(
								layout: CONSTRAINED
								width: 420
								placeholder: BLURRED
							)
						}
					}
					galleryImages {
						childImageSharp {
							gatsbyImageData(
								layout: CONSTRAINED
								placeholder: BLURRED
							)
						}
					}
				}
				fields {
					path
				}
				html
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
