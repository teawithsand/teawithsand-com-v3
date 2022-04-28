import PaintSceneMutation from "@app/Component/DOMPaint/element/scene/PaintSceneMutation"
import PaintDrawDisplay from "@app/Component/DOMPaint/ui/draw/PaintDrawDisplay"
import ActivateToolData from "@app/Component/DOMPaint/ui/newtool/ActivateToolData"
import ActiveTool from "@app/Component/DOMPaint/ui/newtool/ActiveTool"
import Tool from "@app/Component/DOMPaint/ui/newtool/Tool"
import UISceneManagerImpl from "@app/Component/DOMPaint/ui/scene/UISceneManagerImpl"
import GlobalUIState from "@app/Component/DOMPaint/ui/state/GlobalUIState"
import GlobalUIStateManagerImpl from "@app/Component/DOMPaint/ui/state/GlobalUIStateManagerImpl"
import useStickySubscribable from "@app/util/react/hook/useStickySubscribable"
import { useEffect, useMemo, useState } from "react"
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
    const [tool, setTool] = useState<Tool<any>>(() => null as unknown as Tool<any>)

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
        }
    })

    const [toolProps, setToolProps] = useState(null)
    const [activeTool, setActiveTool] = useState<ActiveTool | null>(null)

    useEffect(() => {
        const at = tool.activate(makeActivateData())
        setActiveTool(at.activeTool)
        return () => {
            at.activeTool.close()
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
    return <PaintDrawDisplay
        scene={scene}
        OverlayComponent={tool.OverlayComponent}
        PanelComponent={tool.PanelComponent}
        toolProps={toolProps ?? tool.initialProps}
        globalUIState={globalUIState}
        onDrawEvent={(event) => {
            if (activeTool) {
                activeTool.processEvent(event)
            }
        }}
        onDrawUIEvent={(event) => {}}
    />
}