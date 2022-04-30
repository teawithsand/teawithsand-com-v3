import React from "react"
import { GatsbyImage, IGatsbyImageData, StaticImage } from "gatsby-plugin-image"

export type GalleryItem = (
	| {
			type: "element"
			element: React.FC<{
				style?: React.CSSProperties
				className?: string
			}>
	  }
	| {
			type: "static-image"
			src: string
			alt: string
	  }
	| {
			type: "fluid-image"
			image: IGatsbyImageData
			alt: string
	  }
	| {
			type: "image"
			src?: string
			srcSet?: string
			alt?: string
	  }
) & {
	key: string
}