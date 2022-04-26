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
import { EventSourcing } from "@app/util/lang/eventSourcing"
import PaintSceneMutation from "../../scene/PaintSceneMutation"
import useEventSourcing from "@app/util/react/hook/useEventSourcing"

export default (props: {
    scene: EventSourcing<PaintScene, PaintSceneMutation>,

    processor?: PaintElementProcessor,

    className?: string,
    style?: React.CSSProperties,

    tool?: PaintTool,
}) => {
    const { scene: sceneEventSourcing, processor, tool } = props
    const { height, width } = useWindowDimensions()

    const activeToolRef = useRef<ActivePaintTool | null>(null)

    const ref = useRef<HTMLDivElement | null>()
    const bind = usePaintDraw(ref as any, (event) => {
        if (activeToolRef.current) {
            activeToolRef.current.submitDrawEvent(event)
        }
    })


    useEffect(() => {
        if (tool) {
            const active = tool.activate({
                disableSelf: () => {
                    //NIY
                },
                updateTool: () => {
                    //NIY
                },
                updateTopLevelStyles: () => {
                    //NIY
                },
            }, {
                parentElementRef: ref as any,
                uiState: {
                    fillColor: [0, 0, 0],
                    strokeColor: [0, 0, 0],
                },
                scene: sceneEventSourcing,
            })

            activeToolRef.current = active

            return () => {
                active.close()
            }
        }
    }, [tool])

    const scene = useEventSourcing(sceneEventSourcing)

    return <div
        ref={ref as any as React.MutableRefObject<HTMLDivElement>}
        className={classnames(styles.paintDisplay, props.className)}
        {...bind}
        style={{
            width: width,
            height: height,
            ...(props.style ?? {})
        }}
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