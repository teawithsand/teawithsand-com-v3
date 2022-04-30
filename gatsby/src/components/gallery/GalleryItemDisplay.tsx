import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { GalleryItem } from "@app/components/gallery/GalleryItem"

/**
 * Implementation, which transforms GalleryItem into drawable react component.
 * It's not capable of handling transitions.
 */
export const GalleryItemDisplay = (props: {
	item: GalleryItem
	className?: string
	style?: React.CSSProperties
}) => {
	const { item, className, style } = props

	if (item.type === "element") {
		const Element = item.element
		return <Element />
	} else if (item.type === "image") {
		return (
			<img
				src={item.src}
				alt={item.alt}
				srcSet={item.srcSet}
				className={className}
				style={style}
			/>
		)
	} else if (item.type === "fluid-image") {
		return (
			<GatsbyImage
				image={item.image}
				alt={item.alt}
				className={className}
				style={style}
			/>
		)
	} else {
		throw new Error("Unknown image type")
	}
}

export default GalleryItemDisplay
