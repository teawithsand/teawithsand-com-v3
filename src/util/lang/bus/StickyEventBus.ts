import EventBus, { SimpleEventBus } from "./EventBus"
import {
	StickySubscribable,
	Subscriber,
	SubscriptionCanceler,
} from "./stateSubscribe"

/**
 * Event bus, which:
 * 1. Emits lastEvent to newly registered listener.
 * 2. Stores last event sent.
 * 3. Requires initial event during construction.
 */
export default interface StickyEventBus<T> extends EventBus<T> {
	readonly lastEvent: T
}

export class DefaultStickyEventBus<T>
	implements StickyEventBus<T>, StickySubscribable<T>
{
	private readonly innerBus = new SimpleEventBus()

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

	addSubscriber = (subscriber: Subscriber<T>): SubscriptionCanceler => {
		subscriber(this.lastEvent)
		return this.innerBus.addSubscriber(subscriber)
	}
}
