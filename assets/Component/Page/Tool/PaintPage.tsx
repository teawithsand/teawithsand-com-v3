import PaintCanvas from "@app/Component/UI/Paint/PaintCanvas"
import { DrawableElement } from "@app/util/paint/primitive"
import React from "react"

export default () => {
    const elements: DrawableElement[] = [
        {
            type: "circle",
            figureOptions: {
                type: "fill",
                fillOptions: {
                    color: "black",
                },
                strokeOptions: {
                    color: "red",
                    size: 10,
                },
            },
            point: [100, 100],
            radius: 50,
        },
        {
            type: "image",
            image: 'https://www.lenna.org/len_std.jpg',
            position: [
                [0, 0],
                [100, 100],
            ]
        }
    ]
    
    return <PaintCanvas
        width={200}
        height={200}
        elements={elements}
    />
}