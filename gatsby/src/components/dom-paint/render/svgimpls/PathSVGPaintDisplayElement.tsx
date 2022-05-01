import PathPaintElement from "@app/components/dom-paint/element/impls/PathPaintElement"
import SVGPaintDisplayElementProps from "@app/components/dom-paint/render/svgimpls/SVGPaintDisplayElementProps"
import React from "react"

export default (props: SVGPaintDisplayElementProps<PathPaintElement>) => {
    const { paintElement } = props

    return <path
        d={paintElement.stringPath}
        style={paintElement.svgStyle}
        onClick={props.onClick}
    />
}
