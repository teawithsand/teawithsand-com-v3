import useWindowDimensions from "@app/util/react/hook/windowDimensionsHook"
import React from "react"
import PaintLayer from "../layer/Layer"
import { PaintDisplayInfoContext } from "./PaintDisplayInfo"
import PaintDisplayLayer from "./PaintDisplayLayer"

import styles from "./paintDisplay.scss?module"

export default (props: {
    layers: Iterable<PaintLayer>,
}) => {
    const { layers } = props
    const { height, width } = useWindowDimensions()

    return <div className={styles.paintDisplay}>
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