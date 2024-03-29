import { IGatsbyImageData } from "gatsby-plugin-image"
import React from "react"

export type GalleryItem = (
	| {
			type: "element"
			element: React.FC<{
				style?: React.CSSProperties
				className?: string
			}>
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
