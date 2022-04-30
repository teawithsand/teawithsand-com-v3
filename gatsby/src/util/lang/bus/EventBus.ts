import {
	Subscribable,
	Subscriber,
	SubscriptionCanceler,
} from "./stateSubscribe"

export default interface EventBus<T> extends Subscribable<T> {
	emitEvent(e: T): void
}

export class SimpleEventBus<T> implements EventBus<T>, Subscribable<T> {
	private subscribers: Subscriber<T>[] = []

	emitEvent = (event: T) => {
		this.subscribers.forEach(s => s(event))
	}

	addSubscriber = (subscriber: Subscriber<T>): SubscriptionCanceler => {
		this.subscribers.push(subscriber)

		return () => this.removeSubscriber(subscriber)
	}

	private removeSubscriber = (subscriber: Subscriber<T>) => {
		const i = this.subscribers.findIndex(e => e === subscriber)
		if (i < 0) return // warn maybe?
		this.subscribers.splice(i, 1)
	}
}
