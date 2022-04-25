import PaintElement from "@app/Component/Paint/paint/PaintElement"
import PaintElementsCanvas from "@app/Component/Paint/ui/PaintElementsCanvas"
import React from "react"

export default () => {
    const elements: PaintElement[] = [
        {
            type: "image",
            image: 'https://www.lenna.org/len_std.jpg',
            position: [
                [0, 0],
                [1000, 1000],
            ],
        },
        {
            type: "circle",
            props: {
                action: "fill",
                fillColor: [0, 0, 0, 1],
                strokeCap: "butt",
                strokeColor: [0, 0, 0, 1],
                strokeSize: 10,
            },
            center: [1000 / 2, 1000 / 2],
            radius: 50,
        },
    ]

    return <PaintElementsCanvas
        width={1000}
        height={1000}
        elements={elements}
    />
}