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
import PaintSceneMutation from "../../scene/PaintSceneMutation"
import useEventSourcing from "@app/util/react/hook/useEventSourcing"
import UIState from "../state/UIState"
import UIStateMutator from "../state/UIStateMutator"
import { EventSourcing, NoHistoryEventSourcing } from "@app/util/lang/eventSourcing"
import PaintLayer from "../../layer/Layer"
import PaintLayerMetadata from "../../layer/LayerMetadata"

export default (props: {
    scene: EventSourcing<PaintScene, PaintSceneMutation>,
    state: NoHistoryEventSourcing<UIState, UIStateMutator>,

    processor?: PaintElementProcessor,

    className?: string,
    style?: React.CSSProperties,

    tool?: PaintTool,
}) => {
    const { scene: sceneEventSourcing, processor, tool, state: stateEventSourcing } = props
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
            }, {
                parentElementRef: ref as any,
                uiState: stateEventSourcing,
                scene: sceneEventSourcing,
            })

            activeToolRef.current = active

            return () => {
                active.close()
            }
        }
    }, [tool])

    const scene = useEventSourcing(sceneEventSourcing)
    const state = useEventSourcing(stateEventSourcing)

    const applyCurrentElements = (l: PaintLayer) => {
        const nl = l.copy()
        nl.elements = [...nl.elements, ...state.uncommittedElements]
        return nl
    }

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
                    layer={
                        i === state.activeLayerIndex ? applyCurrentElements(v) : v
                    }
                    key={i}
                />)
            }

            <PaintDisplayLayer
                baseZIndex={(scene.layers.length + 1) * 1000}
                layer={
                    new PaintLayer(
                        state.uncommittedElements,
                        new PaintLayerMetadata()
                    )
                }
            />

            <PaintDisplayLayer
                baseZIndex={(scene.layers.length + 2) * 1000}
                layer={
                    new PaintLayer(
                        state.uncommittedElements,
                        new PaintLayerMetadata()
                    )
                }
            />
        </PaintDisplayInfoContext.Provider>
    </div>
}