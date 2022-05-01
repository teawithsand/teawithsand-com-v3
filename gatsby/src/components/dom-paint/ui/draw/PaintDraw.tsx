import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import PaintDrawDisplay, { DrawUIEvent } from "@app/components/dom-paint/ui/draw/PaintDrawDisplay"
import UISceneManagerImpl from "@app/components/dom-paint/ui/scene/UISceneManagerImpl"
import GlobalUIState from "@app/components/dom-paint/ui/state/GlobalUIState"
import GlobalUIStateManagerImpl from "@app/components/dom-paint/ui/state/GlobalUIStateManagerImpl"
import ActivateToolData from "@app/components/dom-paint/ui/tool/ActivateToolData"
import ActiveTool from "@app/components/dom-paint/ui/tool/ActiveTool"
import MoveTool from "@app/components/dom-paint/ui/tool/impl/MoveTool"
import PathTool from "@app/components/dom-paint/ui/tool/impl/PathTool"
import Tool from "@app/components/dom-paint/ui/tool/Tool"
import { homePath } from "@app/components/paths"
import useStickySubscribable from "@app/util/react/hook/useStickySubscribable"
import { navigate } from "gatsby"
import { useEffect, useMemo, useRef, useState } from "react"

import React from "react"

export default (props: {
    initialMutationsLoader: () => PaintSceneMutation[],
    initialGlobalUIStateLoader: () => GlobalUIState,

    onMutationsChanged?: (mutations: PaintSceneMutation[]) => void,
    onGlobalUIStateChanged?: (state: GlobalUIState) => void,
}) => {
    const {
        onMutationsChanged,
        onGlobalUIStateChanged,
    } = props

    // this is to make sure
    // that initial mutations will stay same forever.
    // New loader won't be called, even if it changes.
    const initialMutations = useMemo(props.initialMutationsLoader, [])
    const initialGlobalUIState = useMemo(props.initialGlobalUIStateLoader, [])

    const uiStateManager = useMemo(() => new GlobalUIStateManagerImpl(initialGlobalUIState), [])
    const uiSceneManager = useMemo(() => new UISceneManagerImpl(initialMutations), [])

    // TODO(teawithsand): supply some tool here instead of null
    const [tool, setTool] = useState<Tool<any>>(() => new PathTool())

    const parentElementRef = useRef<HTMLDivElement | null>(null)

    const makeActivateData = (): ActivateToolData<any> => ({
        globalUIInteraction: uiStateManager,
        globalUIState: uiStateManager.state,
        scene: uiSceneManager.scene,
        sceneInteraction: uiSceneManager,
        setDisplayPropsCallback: (props: any) => {
            setToolProps(props)
        },
        setTool: (tool) => {
            setToolProps(null)
            setTool(tool)
        },
        sceneReference: parentElementRef,
    })

    const [toolProps, setToolProps] = useState<{ [key: string]: any } | null>(null)
    const [activeTool, setActiveTool] = useState<ActiveTool | null>(null)

    useEffect(() => {
        if (tool) {
            const at = tool.activate(makeActivateData())
            setActiveTool(at.activeTool)
            return () => {
                at.activeTool.close()
            }
        }
    }, [tool])

    useEffect(() => {
        if (onMutationsChanged) {
            // TODO(teawithsand): implement this; requires new api in ui scene manager
            //  this function should be called when user requests save or something I guess...
        }
    }, [uiSceneManager, onMutationsChanged])

    useEffect(() => {
        if (onGlobalUIStateChanged) {
            const closer = uiStateManager.state.addSubscriber((state) => {
                onGlobalUIStateChanged(state)
            })

            return () => {
                closer()
            }
        }
    }, [uiStateManager, onGlobalUIStateChanged])


    const scene = useStickySubscribable(uiSceneManager.scene)
    const globalUIState = useStickySubscribable(uiStateManager.state)
    const uncommitedMutations = useStickySubscribable(uiSceneManager.uncommitedMutations)

    const onDrawUIEvent = (event: DrawUIEvent) => {
        if (event.type === "undo") {
            uiSceneManager.popMutationOntoEphemeralStack()
        } else if (event.type === "redo") {
            uiSceneManager.popFromEphemeralStack()
        } else if (event.type === "pick-tool") {
            if (event.tool === "scroll") {
                setTool(new MoveTool())
            } else if (event.tool === "draw") {
                setTool(new PathTool())
            }
        } else if (event.type === "exit") {
            navigate(homePath)
        }
    }

    return <PaintDrawDisplay
        scene={scene}
        uncommitedMutations={uncommitedMutations}
        OverlayComponent={tool.OverlayComponent}
        PanelComponent={tool.PanelComponent}
        toolProps={toolProps ?? tool.initialProps}
        globalUIState={globalUIState}
        onDrawEvent={(event) => {
            if (activeTool) {
                activeTool.processEvent(event)
            }
        }}
        onDrawUIEvent={onDrawUIEvent}
        parentElementRef={parentElementRef}
    />
}