import PaintScene from "@app/components/dom-paint/element/scene/PaintScene"
import { ActiveToolSceneInteraction } from "@app/components/dom-paint/ui/tool/ActivateToolData"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

/**
 * Manager, which handles:
 * 1. Getting scene
 * 2. Interacting with scene
 */
export default interface UISceneManager extends ActiveToolSceneInteraction {
	/**
	 * Current scene.
	 * Users can subscribe to its changes.
	 */
	readonly scene: StickySubscribable<PaintScene>
}
