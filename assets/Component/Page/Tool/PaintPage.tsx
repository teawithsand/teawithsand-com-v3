import ImagePaintElement from "@app/Component/DOMPaint/element/impls/ImagePaintElement"
import PathPaintElement, { PathFillData, PathPaintElementEntry, PathStrokeData } from "@app/Component/DOMPaint/element/impls/PathPaintElement"
import { Rect } from "@app/Component/DOMPaint/primitive"
import React from "react"
import PaintLayer from "@app/Component/DOMPaint/element/scene/PaintLayer"
import TextPaintElement, { textPaintElementDataDefaults } from "@app/Component/DOMPaint/element/impls/TextPaintElement"
import PaintDraw from "@app/Component/DOMPaint/ui/display/PaintDraw"
import PaintScene from "@app/Component/DOMPaint/element/scene/PaintScene"

export default () => {
    const strokeOne: PathStrokeData = {
        color: [0, 255, 0],
        size: 2,
        linecap: "round",
        linejoin: "round",
    }

    const fillOne: PathFillData = {
        color: [128, 128, 128],
    }

    const layers = [
        new PaintLayer({
            metadata: {
                isHidden: false,
                name: "starter",
            },
            elements: [
                new PathPaintElement({
                    entries: [
                        {
                            type: "M",
                            point: [100, 100],
                        },
                        {
                            type: "L",
                            point: [100, 200]
                        },
                        {
                            type: "L",
                            point: [200, 200],
                        },
                        {
                            type: "L",
                            point: [200, 100],
                        },
                        {
                            type: "L",
                            point: [100, 100]
                        },
                    ].map(v => ({
                        type: v.type,
                        point: [
                            v.point[0] - 50,
                            v.point[1] - 50,
                        ]
                    })) as PathPaintElementEntry[],
                    stroke: { ...strokeOne, color: [255, 0, 0], size: 10, },
                    fill: null,
                    filters: [],
                }),

                new PathPaintElement({
                    entries: [
                        {
                            type: "M",
                            point: [100, 100],
                        },
                        {
                            type: "L",
                            point: [100, 200]
                        },
                        {
                            type: "L",
                            point: [200, 200],
                        },
                        {
                            type: "L",
                            point: [200, 100],
                        },
                        {
                            type: "L",
                            point: [100, 100]
                        },
                    ],
                    stroke: { ...strokeOne, color: [0, 0, 255] },
                    fill: null,
                    filters: [],
                }),

                new ImagePaintElement({
                    url: "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png",
                    rect: [
                        [0, 0],
                        [512, 512],
                    ].map(v => v.map(v => v + 100)) as Rect,
                    filters: [],
                }),

                new PathPaintElement({
                    stroke: strokeOne,
                    filters: [],
                    entries: [],
                    fill: null,
                }),

                new TextPaintElement({
                    ...textPaintElementDataDefaults(),
                    text: "This is lena on the picture",
                    startPoint: [800, 800],
                }),
            ],
        })
    ]

    return <PaintDraw
        initialScene={new PaintScene({
            layers,
        })}
    />
}