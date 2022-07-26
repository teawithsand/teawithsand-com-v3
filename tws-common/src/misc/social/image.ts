import { getImage, getSrc, ImageDataLike } from "gatsby-plugin-image"
import { absolutizePath } from "tws-common/lang/path"
import { SEOImage } from "tws-common/react/components/Seo"

export const ogImageWidth = 1200
export const ogImageHeight = 630

export const ogImageWidthToHeightRatio = ogImageWidth / ogImageHeight
export const ogImageHeightToWidthRatio = ogImageHeight / ogImageWidth

/*
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
*/

export const makeSeoImage = (
	domain: string,
	input: ImageDataLike,
): SEOImage | null => {
	const src = getSrc(input)
	if (!src) return null

	const image = getImage(input) ?? null

	const httpUrl = absolutizePath(domain, src, {
		protocol: "http",
	})
	const httpsUrl = absolutizePath(domain, src, {
		protocol: "https",
	})

	return {
		httpsUrl,
		httpUrl,
		width: image?.width ?? undefined,
		height: image?.height ?? undefined,
	}
}
