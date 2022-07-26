import { graphql } from "gatsby"

export const query = graphql`
	fragment Shrine on MarkdownRemark {
		frontmatter {
			title
			slug
			createdAt
			lastEditedAt
			coordinates
			tags
			featuredImage {
				childImageSharp {
					gatsbyImageData(layout: CONSTRAINED, width: 10000)
				}
			}
			featuredImageSocial: featuredImage {
				childImageSharp {
					...OgImage
				}
			}
			galleryImages {
				childImageSharp {
					gatsbyImageData(layout: CONSTRAINED, width: 10000)
				}
			}
		}
		fields {
			path
		}
		excerpt(pruneLength: 240)
		html
	}

	fragment ShrineHeader on MarkdownRemark {
		frontmatter {
			title
			slug
			createdAt
			lastEditedAt
			coordinates
			tags
			featuredImage {
				childImageSharp {
					gatsbyImageData(
						layout: CONSTRAINED
						width: 800
						placeholder: BLURRED
					)
				}
			}
		}
		fields {
			path
		}
		excerpt(pruneLength: 240)
	}

	fragment ShrineReference on MarkdownRemark {
		frontmatter {
			tags
			title
			createdAt
		}
		fields {
			path
		}
	}
`
