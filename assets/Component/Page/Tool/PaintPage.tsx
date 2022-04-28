import React from "react"
import PaintLayer from "@app/Component/DOMPaint/element/scene/PaintLayer"
import PaintDraw from "@app/Component/DOMPaint/ui/display/PaintDraw"
import PaintScene from "@app/Component/DOMPaint/element/scene/PaintScene"

export default () => {
    return <PaintDraw
        initialScene={new PaintScene({
            layers: [
                new PaintLayer({
                    elements: [],
                    metadata: {
                        isHidden: false,
                        name: "layer-0",
                    }
                })
            ],
        })}
    />
}