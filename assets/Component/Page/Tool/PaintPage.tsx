import React from "react"
import PaintDraw from "@app/Component/DOMPaint/ui/draw/PaintDraw"

export default () => {
    return <PaintDraw
        initialMutationsLoader={() => ([
            {
                type: "push-layer",
                elements: [],
                beforeIndex: 0,
                metadata: {
                    isHidden: false,
                    name: "layer-0",
                }
            }
        ])}
        initialGlobalUIStateLoader={() => ({
            activeLayerIndex: 0,
            fill: null,
            selectedElements: [],
            stroke: {
                color: [0, 0, 0],
                linecap: "round",
                linejoin: "round",
                size: 5,
            },
            uncommittedElements: [],
        })}
    />
}