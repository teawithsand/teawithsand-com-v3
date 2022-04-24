import { Subscriber, SubscriptionCanceler } from "./stateSubscribe"

export interface EventBus<E> {
    emitEvent(e: E): void
}

export class SimpleEventBus<E> implements EventBus<E> {
    private subscribers: Subscriber<E>[] = []

    emitEvent = (event: E) => {
        this.subscribers.forEach(s => s(event))
    }

    addSubscriber = (subscriber: Subscriber<E>): SubscriptionCanceler => {
        this.subscribers.push(subscriber)

        return () => this.removeSubscriber(subscriber)
    }

    private removeSubscriber = (subscriber: Subscriber<E>) => {
        const i = this.subscribers.findIndex((e) => e === subscriber)
        if (i < 0)
            return; // warn maybe?
        this.subscribers.splice(i, 1)
    }
}