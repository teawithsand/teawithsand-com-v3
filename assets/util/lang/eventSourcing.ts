import { StickySubscribable } from "./bus/stateSubscribe"
import { DefaultStickyEventBus } from "./bus/StickyEventBus"

export interface EventSourcingAdapter<A, E> {
    // we assume that aggregates aren't immutable
    // futhermore, they are mutable
    applyEvent(aggregate: A, event: E): void
    copy(aggregate: A): A
}

/**
 * Event sourcing, which can't go back in history and does not store events, but only aggregate.
 */
export interface NoHistoryEventSourcing<A, E> {
    readonly aggregate: StickySubscribable<A>

    getEvents(): Iterable<E>

    getAggregateCopy(): A

    applyEvent(event: E): void
    getCurrentVersion(): number
}

/**
 * Small util for managing some class state(the aggregate) using series of events.
 */
export interface EventSourcing<A, E> extends NoHistoryEventSourcing<A, E> {
    popEvent(): void
}

export class InMemoryEventSourcing<A, E> implements EventSourcing<A, E>, NoHistoryEventSourcing<A, E> {
    private innerBus: DefaultStickyEventBus<A>
    private currentAggregateVersion: number = -1

    constructor(
        private readonly adapter: EventSourcingAdapter<A, E>,
        private readonly initialAggregate: A,
        private eventStack: E[],
    ) {
        this.innerBus = new DefaultStickyEventBus(this.initialAggregate)
        this.recomputeCurrentAggregate()
    }

    getEvents(): Iterable<E> {
        return [...this.eventStack]
    }

    get aggregate(): StickySubscribable<A> {
        return this.innerBus
    }

    getAggregateCopy = (): A => this.adapter.copy(this.initialAggregate)

    applyEvent = (event: E): void => {
        this.eventStack.push(event)
        this.recomputeCurrentAggregate()
    }

    popEvent = (): void => {
        if (this.eventStack.length === 0) {
            return
        }
        this.eventStack.pop()
        this.recomputeCurrentAggregate()
    }

    getCurrentVersion = (): number => {
        return this.currentAggregateVersion
    }

    private recomputeCurrentAggregate = () => {
        if (this.eventStack.length > this.currentAggregateVersion) {
            const copy = this.adapter.copy(this.initialAggregate)
            for (const event of this.eventStack) {
                this.adapter.applyEvent(copy, event)
            }
            this.innerBus.emitEvent(copy)
            this.currentAggregateVersion = this.eventStack.length
        } else {
            const copy = this.adapter.copy(this.innerBus.lastEvent)
            for (const event of this.eventStack.slice(this.currentAggregateVersion, this.eventStack.length)) {
                this.adapter.applyEvent(copy, event)
                this.currentAggregateVersion++
            }
            this.innerBus.emitEvent(copy)
        }
    }
}