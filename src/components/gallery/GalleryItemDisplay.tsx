import { GatsbyImage } from "gatsby-plugin-image"
import React from "react"

import { GalleryItem } from "@app/components/gallery/GalleryItem"

/**
 * Implementation, which transforms GalleryItem into drawable react component.
 * It's not capable of handling transitions.
 */
export const GalleryItemDisplay = (props: {
	item: GalleryItem
	className?: string
	style?: React.CSSProperties
	isBottomBar?: boolean
}) => {
	const { item, className, style, isBottomBar } = props

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
		if (!isBottomBar) {
			return <GatsbyImage image={item.image} alt={item.alt} />
		}

		// HACK: I wasn't able to style gatsby image
		// so instead I've rendered id to image myself
		//
		// well, in fact I was able to style it in the end
		// but gatsby sometimes won't render this image until it's shown in top panel
		// which is bad
		//
		// in the end bypass here is ok, the only thing needed here is picture element
		// for multiple format support
		const sources = item.image.images.sources
		let source = sources?.find(s => s.type === "image/webp")
		if (!source && sources && sources.length > 0) source = sources[0]
		return (
			<img
				alt={item.alt}
				srcSet={source?.srcSet ?? ""}
				className={className}
				style={style}
			/>
		)
	} else {
		throw new Error("Unknown image type")
	}
}

export default GalleryItemDisplay
