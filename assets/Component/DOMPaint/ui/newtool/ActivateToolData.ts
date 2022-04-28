import PaintSceneMutation from "@app/Component/DOMPaint/element/scene/PaintSceneMutation"
import UIState from "@app/Component/DOMPaint/ui/state/UIState"
import StickyEventBus from "@app/util/lang/bus/StickyEventBus"

export interface ActiveToolSceneInteraction {
    setUncommitedMutations: (mutations: PaintSceneMutation[]) => void
    // also: unsets uncommited mutations
    commitMutations: (mutations: PaintSceneMutation[]) => void
}


export type ActivateToolData<P> = {
    readonly sceneInteraction: ActiveToolSceneInteraction
    readonly uiState: StickyEventBus<UIState>,

    setDisplayPropsCallback: (props: P) => void
}

export default ActivateToolData