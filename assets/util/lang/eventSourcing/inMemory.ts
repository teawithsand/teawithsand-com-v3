import { StickySubscribable } from "../bus/stateSubscribe"
import { DefaultStickyEventBus } from "../bus/StickyEventBus"
import { EventSourcing, EventSourcingAdapter, NoHistoryEventSourcing } from "./define"

export class InMemoryEventSourcing<A, E> implements EventSourcing<A, E>, NoHistoryEventSourcing<A, E> {
    private innerBus: DefaultStickyEventBus<A>
    private currentAggregateVersion: number = 0

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
        const currentVersionFromEvents = this.eventStack.length + 1
        // TODO(teawithsand): test and debug this code
        if (currentVersionFromEvents < this.currentAggregateVersion) {
            const copy = this.adapter.copy(this.initialAggregate)
            
            for (const event of this.eventStack) {
                this.adapter.applyEvent(copy, event)
            }
            this.innerBus.emitEvent(copy)
            this.currentAggregateVersion = currentVersionFromEvents
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