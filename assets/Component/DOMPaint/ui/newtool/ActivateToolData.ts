import PaintScene from "@app/Component/DOMPaint/element/scene/PaintScene"
import PaintSceneMutation from "@app/Component/DOMPaint/element/scene/PaintSceneMutation"
import Tool from "@app/Component/DOMPaint/ui/newtool/Tool"
import GlobalUIState from "@app/Component/DOMPaint/ui/state/GlobalUIState"
import GlobalUIStateMutation from "@app/Component/DOMPaint/ui/state/GlobalUIStateMutation"
import StickyEventBus from "@app/util/lang/bus/StickyEventBus"

export interface ActiveToolSceneInteraction {
    setUncommitedMutations: (mutations: PaintSceneMutation[]) => void

    /**
     * This action implicitly:
     * 1. Unsets uncommited mutations
     * 2. Clears ephemeral stack.
     */
    commitMutations: (mutations: PaintSceneMutation[]) => void

    /**
     * Pops single mutation from mutations stack to ephemeral stack.
     * In other words, does ctrl+z;
     * 
     * Returns true if stack was modified.
     */
    popMutationOntoEphemeralStack(): boolean

    /***
     * Pops single mutation from ephemeral stack onto mutations stack.
     * In other words does ctrl+y;
     * 
     * Returns true if stack was modified.
     */
    popFromEphemeralStack(): boolean
}

export interface ActiveToolGlobalUIInteraction {
    mutateUIState(state: GlobalUIStateMutation): void
}

export type ActivateToolData<P> = {
    readonly globalUIState: StickyEventBus<GlobalUIState>
    readonly scene: StickyEventBus<PaintScene>

    readonly sceneInteraction: ActiveToolSceneInteraction
    readonly globalUIInteraction: ActiveToolGlobalUIInteraction

    setTool(tool: Tool<unknown>): void
    setDisplayPropsCallback: (props: P) => void
}

export default ActivateToolData