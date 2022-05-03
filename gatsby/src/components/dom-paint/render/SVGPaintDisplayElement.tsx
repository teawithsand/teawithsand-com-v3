import ImagePaintElement from "@app/components/dom-paint/element/impls/ImagePaintElement"
import PathPaintElement from "@app/components/dom-paint/element/impls/PathPaintElement"
import TextPaintElement from "@app/components/dom-paint/element/impls/TextPaintElement"
import PaintElement from "@app/components/dom-paint/element/PaintElement"
import { PaintLayerMetadata } from "@app/components/dom-paint/element/scene/PaintLayer"
import ImageSVGPaintDisplayElement from "@app/components/dom-paint/render/svgimpls/ImageSVGPaintDisplayElement"
import PathSVGPaintDisplayElement from "@app/components/dom-paint/render/svgimpls/PathSVGPaintDisplayElement"
import TextSVGPaintDisplayElement from "@app/components/dom-paint/render/svgimpls/TextSVGPaintDisplayElement"
import React from "react"

export default (props: {
	paintElement: PaintElement
	layerMetadata: PaintLayerMetadata
}) => {
	const { paintElement } = props

	if (paintElement instanceof PathPaintElement) {
		return <PathSVGPaintDisplayElement {...props} paintElement={paintElement} />
	} else if (paintElement instanceof ImagePaintElement) {
		return (
			<ImageSVGPaintDisplayElement {...props} paintElement={paintElement} />
		)
	} else if (paintElement instanceof TextPaintElement) {
		return <TextSVGPaintDisplayElement {...props} paintElement={paintElement} />
	} else {
		throw new Error(`unsupported element ${paintElement}`)
	}
}
