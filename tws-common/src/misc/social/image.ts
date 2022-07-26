import { graphql } from "gatsby"

export const ogImageWidth = 1200
export const ogImageHeight = 630

export const ogImageWidthToHeightRatio = ogImageWidth / ogImageHeight
export const ogImageHeightToWidthRatio = ogImageHeight / ogImageWidth

export const ogImageFragment = graphql`
	fragment OgImage on ChildImageSharp {
		gatsbyImageData(
			layout: CONSTRAINED
			width: 1200
			height: 630
			formats: [JPG]
			transformOptions: { cropFocus: ATTENTION, fit: COVER }
		)
	}
`
export const ogImageQuery = `
        gatsbyImageData(
            layout: CONSTRAINED
            width: 1200
            height: 630
            formats: [JPG]
            transformOptions: { cropFocus: ATTENTION, fit: COVER }
        )
`
