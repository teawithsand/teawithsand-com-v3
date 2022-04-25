import ImagePaintElement from "@app/Component/DOMPaint/element/ImagePaintElement"
import PaintElementFill from "@app/Component/DOMPaint/element/PaintElementFill"
import PaintElementStroke from "@app/Component/DOMPaint/element/PaintElementStroke"
import PathPaintElement from "@app/Component/DOMPaint/element/PathPaintElement"
import PolygonPaintElement from "@app/Component/DOMPaint/element/PolygonPaintElement"
import PaintLayer from "@app/Component/DOMPaint/layer/Layer"
import PaintLayerMetadata from "@app/Component/DOMPaint/layer/LayerMetadata"
import { Point, Rect } from "@app/Component/DOMPaint/primitive"
import PaintDisplay from "@app/Component/DOMPaint/ui/PaintDisplay"
import { GenerateUUID } from "@app/util/lang/uuid"
import React, { useState } from "react"

export default () => {
    const strokeOne: PaintElementStroke = {
        color: [0, 255, 0],
        size: 2,
    }
    const fillOne: PaintElementFill = {
        color: [128, 128, 128],
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

                    new ImagePaintElement({
                        url: "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png",
                        objectFit: "contain",
                        rect: [
                            [0, 0],
                            [512, 512],
                        ].map(v => v.map(v => v + 100)) as Rect,
                        renderId: "e3",
                    }),

                    new PolygonPaintElement({
                        points,
                        stroke: strokeOne,
                        autoClose: false,
                        fill: fillOne,
                        renderId: GenerateUUID(),
                    }),
                ],
                new PaintLayerMetadata()
            )
        ]} />
}