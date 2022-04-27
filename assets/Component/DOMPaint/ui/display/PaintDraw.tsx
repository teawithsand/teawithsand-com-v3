import { EventSourcing, InMemoryEventSourcing, NoHistoryEventSourcing, NoHistoryInMemoryEventSourcing } from "@app/util/lang/eventSourcing"
import useEventSourcing from "@app/util/react/hook/useEventSourcing"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import PaintScene, { paintSceneEventSourcingAdapter } from "../../element/scene/PaintScene"
import PaintSceneMutation from "../../element/scene/PaintSceneMutation"
import UIState, { initialUIState, uiStateEventSourcingAdapter } from "../state/UIState"
import UIStateMutator from "../state/UIStateMutator"
import ActivePaintTool from "../tool/ActivePaintTool"
import PathPaintTool from "../tool/impl/PathPaintTool"
import ScrollPaintTool from "../tool/impl/ScrollPaintTool"
import PaintDrawDisplay from "./PaintDrawDisplay"

export default (props: {
    className?: string,
    style?: React.CSSProperties,

    initialScene?: PaintScene,
}) => {
    const parentElementRef = useRef<HTMLDivElement | null>(null)
    const { initialScene } = props
    const [sceneEventSourcing, setSceneEventSourcing] = useState(() => new InMemoryEventSourcing(
        paintSceneEventSourcingAdapter,
        new PaintScene({ layers: [] }),
        [],
    ))
    const [uiStateEventSourcing, setUiStateEventSourcing] = useState(() => new NoHistoryInMemoryEventSourcing(
        uiStateEventSourcingAdapter,
        {
            ...initialUIState,
            uncommittedElements: [],
        },
    ))

    useEffect(() => {
        const oldScene = sceneEventSourcing
        const newScene = new InMemoryEventSourcing(
            paintSceneEventSourcingAdapter,
            new PaintScene({
                layers: [...(initialScene?.data?.layers ?? [])],
            }),
            [...oldScene.getEvents()],
        )

        setSceneEventSourcing(newScene)
    }, [initialScene])



    const [tool, setTool] = useState(() => new PathPaintTool())
    const activeToolRef = useRef<ActivePaintTool | null>(null)

    useLayoutEffect(() => {
        const res = tool.activate({
            // TODO(teawithsand): make these two callbacks obsolete by doing trick similar to one done with uiState and scene:
            //  move them to some owner/manager object, which is capable of changing them

            disableSelf: () => {
                setTool(new ScrollPaintTool())
            },
            updateTool: (tool) => {
                setTool(tool)
            },
        }, {
            uiState: uiStateEventSourcing,
            scene: sceneEventSourcing,
            parentElementRef: parentElementRef as React.MutableRefObject<HTMLDivElement>,
        })

        activeToolRef.current = res

        return () => {
            res.close()
        }
    }, [tool, uiStateEventSourcing, sceneEventSourcing])

    const scene = useEventSourcing(sceneEventSourcing)
    const uiState = useEventSourcing(uiStateEventSourcing)

    return <PaintDrawDisplay
        parentElementRef={parentElementRef}
        className={props.className}
        style={props.style}
        scene={scene}
        uiState={uiState}
        onDrawEvent={(event) => {
            if (activeToolRef.current) {
                activeToolRef.current.submitDrawEvent(event)
            }
        }}
        onPaintDrawUIEvent={(event) => {
            if (event.type === "pick-tool") {
                if (event.tool === "draw") {
                    setTool(new PathPaintTool())
                } else if (event.tool === "scroll") {
                    setTool(new ScrollPaintTool())
                }
            } else if (event.type === "undo") {
                if (sceneEventSourcing.getCurrentVersion() > 0) {
                    sceneEventSourcing.popEvent()
                }
            }
        }}

    />
}