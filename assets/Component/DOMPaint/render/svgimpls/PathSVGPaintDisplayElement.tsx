import React from "react"
import PathPaintElement from "../../element/impls/PathPaintElement"
import SVGPaintDisplayElementProps from "./SVGPaintDisplayElementProps"

export default (props: SVGPaintDisplayElementProps<PathPaintElement>) => {
    const { paintElement } = props

    return <path
        d={paintElement.stringPath}
        style={paintElement.svgStyle}
    />
}
