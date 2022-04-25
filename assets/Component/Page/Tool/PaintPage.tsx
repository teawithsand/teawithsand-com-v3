import PaintElementStroke from "@app/Component/DOMPaint/element/PaintElementStroke"
import PathPaintElement from "@app/Component/DOMPaint/element/PathPaintElement"
import PaintLayer from "@app/Component/DOMPaint/layer/Layer"
import PaintLayerMetadata from "@app/Component/DOMPaint/layer/LayerMetadata"
import PaintDisplay from "@app/Component/DOMPaint/ui/PaintDisplay"
import React from "react"

export default () => {
    const strokeOne: PaintElementStroke = {
        color: [0, 255, 0],
        size: 2,
    }

    return <PaintDisplay layers={[
        new PaintLayer(
            [
                new PathPaintElement({
                    points: [
                        [100, 100],
                        [100, 200],
                        [200, 200],
                        [200, 100],
                        [100, 100],
                    ].map(v => [v[0] + 50, v[1] + 50]),
                    stroke: { ...strokeOne, color: [255, 0, 0] },
                    renderId: "p2",
                }),

                new PathPaintElement({
                    points: [
                        [100, 100],
                        [100, 200],
                        [200, 200],
                        [200, 100],
                        [100, 100],
                    ],
                    stroke: strokeOne,
                    renderId: "p1"
                }),
            ],
            new PaintLayerMetadata()
        )
    ]} />
}