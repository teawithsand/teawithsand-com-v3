import React from "react"
import PaintLayer from "../layer/Layer"
import PaintDisplayElement from "./PaintDisplayElement"

export default (props: {
    layer: PaintLayer,
    baseZIndex: number,
}) => {
    const { layer, baseZIndex } = props
    return <>
        {
            [...layer.elements]
                .map((v, i) => <PaintDisplayElement
                    key={v.renderId}
                    element={v}
                    zIndex={baseZIndex + i}
                />)
        }
    </>
}
