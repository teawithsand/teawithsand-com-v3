import React, { useMemo } from "react"
import PaintElement from "../element/PaintElement"
import { PaintDisplayElementInfoContext } from "./PaintDisplayElementInfo"
import PaintDisplaySceneProps from "./PaintDisplaySceneProps"
import SVGPaintDisplayElement from "./SVGPaintDisplayElement"

export default (props: PaintDisplaySceneProps & {
    width: number,
    height: number,
}) => {
    const { scene, activeLayerIndex, activeLayerElements, width, height, style, className } = props

    const elements = useMemo(() => {
        return scene.data.layers.flatMap((l, i) => {
            if (l.data.metadata.isHidden)
                return [];

            let elements: PaintElement[]
            if (i === activeLayerIndex) {
                elements = [...l.data.elements, ...activeLayerElements]
            } else {
                elements = l.data.elements
            }

            return elements.map((e) => ({
                paintElement: e,
                layerMetadata: l.data.metadata,
            }))
        })
    }, [scene, scene.renderHash, activeLayerIndex, activeLayerElements])

    return <PaintDisplayElementInfoContext.Provider value={{
        canvasHeight: height,
        canvasWidth: width,
    }}>
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}
            style={style}
            className={className}
        >
            {
                elements
                    .map(e => <SVGPaintDisplayElement
                        paintElement={e.paintElement}
                        layerMetadata={e.layerMetadata}
                        key={e.paintElement.renderHash}
                    />)
            }
        </svg>
    </PaintDisplayElementInfoContext.Provider>
}
