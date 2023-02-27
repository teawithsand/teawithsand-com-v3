import { DefaultEventBus, EventBus } from "tws-common/event-bus/eventBus"
import {
	StickySubscribable,
	Subscriber,
	SubscriptionCanceler,
} from "tws-common/event-bus/subscribable"

export default interface StickyEventBus<T>
	extends EventBus<T>,
		StickySubscribable<T> {
	readonly lastEvent: T
}

export class DefaultStickyEventBus<T> implements StickyEventBus<T> {
	private readonly innerBus = new DefaultEventBus<T>()

	constructor(private innerLastEvent: T) {}

	get lastEvent(): T {
		return this.innerLastEvent
	}

	emitEvent = (event: T) => {
		// Note: this behavior must be as-is
		// before invocation of handler, last event must be updated
		this.innerLastEvent = event
		this.innerBus.emitEvent(event)
	}

	addSubscriber = (
		subscriber: Subscriber<T>,
		emitLastEventToNewSubscriber = true,
	): SubscriptionCanceler => {
		if (emitLastEventToNewSubscriber) {
			subscriber(this.lastEvent)
		}
		return this.innerBus.addSubscriber(subscriber)
	}
}
