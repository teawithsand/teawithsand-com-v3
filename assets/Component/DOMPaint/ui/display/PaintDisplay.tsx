import React, { useCallback, useEffect, useMemo, useRef } from "react"

import PaintScene from "../../element/scene/PaintScene"
import PaintTool from "../tool/PaintTool"
import PaintSceneMutation from "../../element/scene/PaintSceneMutation"
import UIState from "../state/UIState"
import UIStateMutator from "../state/UIStateMutator"
import { EventSourcing, NoHistoryEventSourcing } from "@app/util/lang/eventSourcing"
import ActivePaintTool from "../tool/ActivePaintTool"
import usePaintDraw from "./usePaintDraw"
import useEventSourcing from "@app/util/react/hook/useEventSourcing"
import classnames from "@app/util/lang/classnames"
import { PaintDisplayInfoContext } from "../../render/PaintDisplayInfo"
import SVGPaintDisplayElement from "../../render/SVGPaintDisplayElement"
import PaintElement from "../../element/PaintElement"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"

export default (props: {
    scene: EventSourcing<PaintScene, PaintSceneMutation>,
    state: NoHistoryEventSourcing<UIState, UIStateMutator>,

    className?: string,
    style?: React.CSSProperties,

    tool?: PaintTool,
}) => {
    const { scene: sceneEventSourcing, tool, state: stateEventSourcing } = props
    const { height, width } = getUsefulDimensions()

    const activeToolRef = useRef<ActivePaintTool | null>(null)

    const ref = useRef<HTMLDivElement | null>()

    const paintDrawCallback = useCallback((event) => {
        if (activeToolRef.current) {
            activeToolRef.current.submitDrawEvent(event)
        }
    }, [])

    const bind = usePaintDraw(ref as any, paintDrawCallback)

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

    const elements = useMemo(() => {
        return scene.data.layers.flatMap((l, i) => {
            if (l.data.metadata.isHidden)
                return [];

            let elements: PaintElement[]
            if (i === state.activeLayerIndex) {
                elements = [...l.data.elements, ...state.uncommittedElements]
            } else {
                elements = l.data.elements
            }

            return elements.map((e) => ({
                paintElement: e,
                layerMetadata: l.data.metadata,
            }))
        })
    }, [scene, scene.renderHash, state.uncommittedElements, state.activeLayerIndex])

    return <div
        ref={ref as any as React.MutableRefObject<HTMLDivElement>}
        className={classnames(props.className)}
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
            <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
                {
                    elements
                        .map(e => <SVGPaintDisplayElement
                            paintElement={e.paintElement}
                            layerMetadata={e.layerMetadata}
                            key={e.paintElement.renderHash}
                        />)
                }
            </svg>
        </PaintDisplayInfoContext.Provider>
    </div>
}