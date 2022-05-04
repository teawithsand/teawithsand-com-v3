import PaintScene, {
	paintSceneEventSourcingAdapter,
} from "@app/components/dom-paint/element/scene/PaintScene"
import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import UISceneManager from "@app/components/dom-paint/ui/scene/UISceneManager"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"
import StickyEventBus, {
	DefaultStickyEventBus,
} from "@app/util/lang/bus/StickyEventBus"
import {
	EventSourcing,
	InMemoryEventSourcing,
} from "@app/util/lang/eventSourcing"

export default class UISceneManagerImpl implements UISceneManager {
	private readonly innerSceneEventSourcing: EventSourcing<
		PaintScene,
		PaintSceneMutation
	>
	private ephemeralStack: PaintSceneMutation[] = []
	private innerUncommitedMutations: StickyEventBus<PaintSceneMutation[]> =
		new DefaultStickyEventBus([])

	constructor(initialMutationsStack: PaintSceneMutation[]) {
		this.innerSceneEventSourcing = new InMemoryEventSourcing<
			PaintScene,
			PaintSceneMutation
		>(paintSceneEventSourcingAdapter, new PaintScene({ layers: [] }), [
			...initialMutationsStack,
		])
	}

	get scene(): StickySubscribable<PaintScene> {
		return this.innerSceneEventSourcing.aggregate
	}

	get uncommitedMutations(): StickySubscribable<PaintSceneMutation[]> {
		return this.innerUncommitedMutations
	}

	setUncommitedMutations = (mutations: PaintSceneMutation[]) => {
		this.innerUncommitedMutations.emitEvent(mutations)
	}

	commitMutations = (mutations: PaintSceneMutation[]) => {
		this.innerUncommitedMutations.emitEvent([])
		this.ephemeralStack = []
		for (const m of mutations) {
			this.innerSceneEventSourcing.applyEvent(m)
		}
	}

	popMutationOntoEphemeralStack = (): boolean => {
		const e = this.innerSceneEventSourcing.popEvent()
		if (e === null) return false
		this.ephemeralStack.push(e)
		return true
	}

	popFromEphemeralStack = (): boolean => {
		if (this.ephemeralStack.length > 0) {
			const e = this.ephemeralStack.pop()
			if (!e) throw new Error("Expected mutation to be there")
			this.innerSceneEventSourcing.applyEvent(e)
			return true
		}
		return false
	}
}
