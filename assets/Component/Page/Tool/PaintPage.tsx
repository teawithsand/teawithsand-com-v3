import ImagePaintElement from "@app/Component/DOMPaint/element/impls/ImagePaintElement"
import PaintElementFill from "@app/Component/DOMPaint/element/PaintElementFill"
import PaintElementStroke from "@app/Component/DOMPaint/element/PaintElementStroke"
import PathPaintElement from "@app/Component/DOMPaint/element/impls/PathPaintElement"
import PaintLayer from "@app/Component/DOMPaint/layer/Layer"
import PaintLayerMetadata from "@app/Component/DOMPaint/layer/LayerMetadata"
import { Rect } from "@app/Component/DOMPaint/primitive"
import { generateUUID } from "@app/util/lang/uuid"
import React from "react"
import PaintScene from "@app/Component/DOMPaint/scene/PaintScene"
import PaintDisplay from "@app/Component/DOMPaint/ui/display/PaintDisplay"
import { InMemoryEventSourcing, NoHistoryInMemoryEventSourcing } from "@app/util/lang/eventSourcing"
import PickPaintTool from "@app/Component/DOMPaint/ui/tool/impl/PickPaintTool"
import { initialUIState, uiStateEventSourcingAdapter } from "@app/Component/DOMPaint/ui/state/UIState"
import PathPaintTool from "@app/Component/DOMPaint/ui/tool/impl/PathPaintTool"

export default () => {
    const strokeOne: PaintElementStroke = {
        color: [0, 255, 0],
        size: 2,
    }
    const fillOne: PaintElementFill = {
        color: [128, 128, 128],
    }

    const layers = [
        new PaintLayer(
            [
                new PathPaintElement({
                    points: [
                        [100, 100],
                        [100, 200],
                        [200, 200],
                        [200, 100],
                        [100, 100],
                    ].map(v => [v[0] - 50, v[1] - 50]),
                    stroke: { ...strokeOne, color: [255, 0, 0], size: 10, },
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

                new PathPaintElement({
                    points: [],
                    stroke: strokeOne,
                    renderId: generateUUID(),
                }),
            ],
            new PaintLayerMetadata()
        )
    ]

    return <PaintDisplay
        tool={new PathPaintTool()}
        state={new NoHistoryInMemoryEventSourcing(uiStateEventSourcingAdapter, initialUIState)}
        scene={
            new InMemoryEventSourcing(
                {
                    applyEvent: (agg, event) => {
                        agg.applyMutation(event)
                    },
                    copy: (a) => new PaintScene([...a.layers]) // shallow copy of layers should be ok(?)
                },
                new PaintScene(layers),
                [],
            )
        } />
}