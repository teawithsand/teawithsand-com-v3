import TextPaintElement from "@app/components/dom-paint/element/impls/TextPaintElement"
import SVGPaintDisplayElementProps from "@app/components/dom-paint/render/svgimpls/SVGPaintDisplayElementProps"
import React from "react"

/**
 * Note: this renderer renders SVG element.
 */
export default (props: SVGPaintDisplayElementProps<TextPaintElement>) => {
    const { paintElement } = props

    return <text
        x={paintElement.data.startPoint[0]}
        y={paintElement.data.startPoint[1]}
        onDragStart={(e) => e.preventDefault()}
        onClick={props.onClick}
        style={paintElement.svgStyle}
    >
        {paintElement.data.text}
    </text>
}
