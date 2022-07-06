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
						createdAt: u.frontmatter.createdAt,
						excerpt: u.excerpt,
						lastEditedAt: u.frontmatter.lastEditedAt || null,
						coordinates: u.frontmatter.coordinates as [
							number,
							number,
						],
						path: u.fields.path,
						tags: [...u.frontmatter.tags],
						html: u.html,
						featuredImage: u.frontmatter.featuredImage,
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
					createdAt
					lastEditedAt
					coordinates
					tags
					featuredImage {
						childImageSharp {
							gatsbyImageData(layout: CONSTRAINED)
						}
					}
					galleryImages {
						childImageSharp {
							gatsbyImageData(layout: CONSTRAINED)
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
					createdAt(formatString: "MMMM DD, YYYY")
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
					createdAt(formatString: "MMMM DD, YYYY")
				}
				fields {
					path
				}
			}
		}
	}
`
