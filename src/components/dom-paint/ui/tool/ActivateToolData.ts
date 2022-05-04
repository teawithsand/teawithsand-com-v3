import PaintScene from "@app/components/dom-paint/element/scene/PaintScene"
import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import GlobalUIState from "@app/components/dom-paint/ui/state/GlobalUIState"
import GlobalUIStateMutation from "@app/components/dom-paint/ui/state/GlobalUIStateMutation"
import Tool from "@app/components/dom-paint/ui/tool/Tool"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

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
	readonly globalUIState: StickySubscribable<GlobalUIState>
	readonly scene: StickySubscribable<PaintScene>

	readonly sceneInteraction: ActiveToolSceneInteraction
	readonly globalUIInteraction: ActiveToolGlobalUIInteraction

	readonly sceneReference: { readonly current: HTMLElement | null }

	setTool(tool: Tool<any>): void
	setDisplayPropsCallback: (props: P) => void
}

export default ActivateToolData
