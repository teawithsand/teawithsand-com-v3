import useWindowDimensions from "@app/util/react/hook/windowDimensionsHook"
import React, { useRef } from "react"
import PaintLayer from "../layer/Layer"
import { PaintDisplayInfoContext } from "./PaintDisplayInfo"
import PaintDisplayLayer from "./PaintDisplayLayer"

import styles from "./paintDisplay.scss?module"
import usePaintDraw from "@app/Component/Page/Tool/usePaintDraw"
import DrawEvent from "./DrawEvent"
import classnames from "@app/util/lang/classnames"
import PaintElementProcessor from "../element/processor/PaintElementProcessor"

export default (props: {
    layers: Iterable<PaintLayer>,

    processor?: PaintElementProcessor,

    onDrawEvent?: (e: DrawEvent) => void,
    className?: string,
    style?: React.CSSProperties,
}) => {
    const { layers, onDrawEvent, processor } = props
    const { height, width } = useWindowDimensions()

    const ref = useRef()
    const bind = usePaintDraw(ref, (event) => {
        if (onDrawEvent) {
            onDrawEvent(event)
        }
    })

    return <div
        ref={ref as React.MutableRefObject<HTMLDivElement>}
        className={classnames(styles.paintDisplay, props.className)}
        {...bind}
        style={props.style}
    >
        <PaintDisplayInfoContext.Provider value={{
            canvasHeight: height * 2,
            canvasWidth: width * 2,
        }}>
            {
                [...layers].filter((l) => !l.metadata.isHidden).map((v, i) => <PaintDisplayLayer
                    topLevelProcessor={processor}
                    baseZIndex={(i + 1) * 1000}
                    layer={v}
                    key={i}
                />)
            }
        </PaintDisplayInfoContext.Provider>
    </div>
}