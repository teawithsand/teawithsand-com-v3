import React from "react"
import PaintElementProcessor from "../element/processor/PaintElementProcessor"
import PaintLayer from "../layer/Layer"
import PaintDisplayElement from "./PaintDisplayElement"

export default (props: {
    topLevelProcessor?: PaintElementProcessor,
    layer: PaintLayer,
    baseZIndex: number,
}) => {
    const { layer, baseZIndex, topLevelProcessor } = props
    return <>
        {
            layer.elements
                .map((v, i) => {
                    if (layer.processor) {
                        layer.processor(v)
                    }
                    if (topLevelProcessor) {
                        v = topLevelProcessor(v)
                    }
                    return <PaintDisplayElement
                        key={i}
                        element={v}
                        zIndex={baseZIndex + i}
                    />
                })
        }
    </>
}
