import { StickySubscribable } from "../bus/stateSubscribe"
import { DefaultStickyEventBus } from "../bus/StickyEventBus"
import { EventSourcingAdapter, NoHistoryEventSourcing } from "./define"

export class NoHistoryInMemoryEventSourcing<A, E>
	implements NoHistoryEventSourcing<A, E>
{
	private innerBus: DefaultStickyEventBus<A>
	private currentAggregateVersion: number = 0

	constructor(
		private readonly adapter: EventSourcingAdapter<A, E>,
		private readonly initialAggregate: A,
	) {
		this.innerBus = new DefaultStickyEventBus(this.initialAggregate)
	}

	get aggregate(): StickySubscribable<A> {
		return this.innerBus
	}

	getAggregateCopy = (): A => this.adapter.copy(this.initialAggregate)

	applyEvent = (event: E): void => {
		const copy = this.adapter.copy(this.innerBus.lastEvent)
		this.adapter.applyEvent(copy, event)
		this.currentAggregateVersion++
		this.innerBus.emitEvent(copy)
	}

	getCurrentVersion = (): number => {
		return this.currentAggregateVersion
	}
}
