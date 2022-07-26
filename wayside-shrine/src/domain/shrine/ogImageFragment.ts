import { graphql } from "gatsby"

// TODO(teawithsand): find a way to ensure that it's in sync with tws-common
export const query = graphql`
	fragment OgImage on ImageSharp {
		gatsbyImageData(
			layout: CONSTRAINED
			width: 1200
			height: 630
			formats: [JPG]
			transformOptions: { cropFocus: ATTENTION, fit: COVER }
		)
	}
`
