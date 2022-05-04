import GlobalUIState from "@app/components/dom-paint/ui/state/GlobalUIState"
import { ActiveToolGlobalUIInteraction } from "@app/components/dom-paint/ui/tool/ActivateToolData"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

export default interface GlobalUIStateManager
	extends ActiveToolGlobalUIInteraction {
	/**
	 * Current ui state to use.
	 */
	readonly state: StickySubscribable<GlobalUIState>
}
