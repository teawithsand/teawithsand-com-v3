import { ActiveToolGlobalUIInteraction } from "@app/Component/DOMPaint/ui/newtool/ActivateToolData"
import GlobalUIState from "@app/Component/DOMPaint/ui/state/GlobalUIState"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

export default interface GlobalUIStateManager extends ActiveToolGlobalUIInteraction {
    /**
     * Current ui state to use.
     */
    readonly state: StickySubscribable<GlobalUIState>
}