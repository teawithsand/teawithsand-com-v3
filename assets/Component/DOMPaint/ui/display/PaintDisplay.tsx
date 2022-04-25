import useWindowDimensions from "@app/util/react/hook/windowDimensionsHook"
import React, { useEffect, useRef } from "react"

import styles from "./paintDisplay.scss?module"
import usePaintDraw from "@app/Component/DOMPaint/ui/display/usePaintDraw"
import PaintScene from "../../scene/PaintScene"
import PaintElementProcessor from "../../element/processor/PaintElementProcessor"
import PaintTool from "../tool/PaintTool"
import ActivePaintTool from "../tool/ActivePaintTool"
import classnames from "@app/util/lang/classnames"
import { PaintDisplayInfoContext } from "../../render/PaintDisplayInfo"
import PaintDisplayLayer from "../../render/PaintDisplayLayer"
export default (props: {
    scene: PaintScene,

    processor?: PaintElementProcessor,
    onSceneUpdate?: (scene: PaintScene) => void,

    className?: string,
    style?: React.CSSProperties,

    tool?: PaintTool,
}) => {
    const { scene, processor, tool, onSceneUpdate } = props
    const { height, width } = useWindowDimensions()

    const activeToolRef = useRef<ActivePaintTool | null>(null)

    const ref = useRef()
    const bind = usePaintDraw(ref, (event) => {
        if (activeToolRef.current) {
            activeToolRef.current.submitDrawEvent(event)
        }
        /*
        if (onDrawEvent) {
            onDrawEvent(event)
        }
        */
    })


    useEffect(() => {
        if (tool) {
            const active = tool.activate({
                updateScene: (scene) => {
                    if (onSceneUpdate) {
                        onSceneUpdate(scene)
                    }
                },
                disableSelf: () => {
                    //NIY
                },
                updateTool: () => {
                    //NIY
                },
                updateTopLevelStyles: () => {
                    //NIY
                }
            }, {
                parentElementRef: ref,
                uiState: {
                    fillColor: [0, 0, 0],
                    strokeColor: [0, 0, 0],
                }
            })

            activeToolRef.current = active

            return () => {
                active.close()
            }
        }
    }, [tool])

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
                [...scene.layers].filter((l) => !l.metadata.isHidden).map((v, i) => <PaintDisplayLayer
                    topLevelProcessor={processor}
                    baseZIndex={(i + 1) * 1000}
                    layer={v}
                    key={i}
                />)
            }
        </PaintDisplayInfoContext.Provider>
    </div>
}