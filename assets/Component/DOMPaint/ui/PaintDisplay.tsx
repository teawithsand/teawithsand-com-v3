import useWindowDimensions from "@app/util/react/hook/windowDimensionsHook"
import React, { useRef } from "react"
import PaintLayer from "../layer/Layer"
import { PaintDisplayInfoContext } from "./PaintDisplayInfo"
import PaintDisplayLayer from "./PaintDisplayLayer"

import styles from "./paintDisplay.scss?module"
import usePaintDraw from "@app/Component/Page/Tool/usePaintDraw"
import DrawEvent from "./DrawEvent"

export default (props: {
    layers: Iterable<PaintLayer>,
    onDrawEvent?: (e: DrawEvent) => void
}) => {
    const { layers, onDrawEvent } = props
    const { height, width } = useWindowDimensions()

    const ref = useRef()
    const bind = usePaintDraw(ref, (event) => {
        if (onDrawEvent) {
            onDrawEvent(event)
        }
    })


    return <div
        ref={ref as React.MutableRefObject<HTMLDivElement>}
        className={styles.paintDisplay}
        {...bind}
    >
        <PaintDisplayInfoContext.Provider value={{
            canvasHeight: height,
            canvasWidth: width,
        }}>
            {
                [...layers].map((v, i) => <PaintDisplayLayer
                    baseZIndex={(i + 1) * 1000}
                    layer={v}
                    key={i}
                />)
            }
        </PaintDisplayInfoContext.Provider>
    </div>
}