import PaintElementStroke from "@app/Component/DOMPaint/element/PaintElementStroke"
import PathPaintElement from "@app/Component/DOMPaint/element/PathPaintElement"
import PaintLayer from "@app/Component/DOMPaint/layer/Layer"
import PaintLayerMetadata from "@app/Component/DOMPaint/layer/LayerMetadata"
import { Point } from "@app/Component/DOMPaint/primitive"
import PaintDisplay from "@app/Component/DOMPaint/ui/PaintDisplay"
import { GenerateUUID } from "@app/util/lang/uuid"
import React, { useState } from "react"

export default () => {
    const strokeOne: PaintElementStroke = {
        color: [0, 255, 0],
        size: 2,
    }

    const [points, setPoints] = useState<Point[]>([])
    return <PaintDisplay
        onDrawEvent={(e) => {
            if (e.type === "mouse") {
                if (e.pressed) {
                    setPoints([...points, e.point])
                }
            }
        }}
        layers={[
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
                        stroke: { ...strokeOne, color: [0, 0, 255] },
                        renderId: "p1"
                    }),

                    new PathPaintElement({
                        points,
                        stroke: strokeOne,
                        renderId: GenerateUUID(),
                    }),
                ],
                new PaintLayerMetadata()
            )
        ]} />
}