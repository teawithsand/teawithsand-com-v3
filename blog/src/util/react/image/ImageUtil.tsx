import * as React from "react"

import classnames from "@app/util/lang/classnames"

import { ResponsiveImage } from "./responsive"

/**
 * Either URL or responsive image.
 */
export type ImageSource = string | ResponsiveImage

/**
 * Element, which wraps standard HTML img element.
 */
export default (props: {
	src: ImageSource
	className?: string
	style?: React.StyleHTMLAttributes<HTMLImageElement>
	alt?: string

	onClick?: () => void

	width?: number
	height?: number

	fluid?: boolean
	rounded?: boolean
	roundedCircle?: boolean
	thumbnail?: boolean
}) => {
	let src: string | undefined = undefined
	let srcSet: string | undefined = undefined
	const image = props.src
	if (typeof image === "string") {
		src = image
	} else {
		src = image.src
		srcSet = image.srcSet
	}

	return (
		<img
			onClick={props.onClick}
			src={src}
			srcSet={srcSet}
			style={props.style}
			alt={props.alt}
			className={classnames(props.className)}
			/*
        fluid={props.fluid}
        rounded={props.rounded}
        thumbnail={props.thumbnail}
        */
			width={props.width}
			height={props.height}
		/>
	)
}
