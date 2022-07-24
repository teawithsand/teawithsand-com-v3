import { graphql } from "gatsby";


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
					gatsbyImageData(layout: CONSTRAINED)
				}
			}
			featuredImageSocial: featuredImage {
				childImageSharp {
					gatsbyImageData(
						layout: CONSTRAINED
						width: 1200
						height: 630
						formats: [JPG]
						transformOptions: { cropFocus: ATTENTION, fit: COVER }
					)
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