import { StickySubscribable } from "../bus/stateSubscribe";


/**
 * @deprecated This event sourcing stuff is not supported and shouldn't be used.
 */
export interface EventSourcingAdapter<A, E> {
	// we assume that aggregates aren't immutable
	// futhermore, they are mutable
	applyEvent(aggregate: A, event: E): void
	copy(aggregate: A): A
}

/**
 * Event sourcing, which can't go back in history and does not store events, but only aggregate.
 * 
 * @deprecated This event sourcing stuff is not supported and shouldn't be used.
 */
export interface NoHistoryEventSourcing<A, E> {
	readonly aggregate: StickySubscribable<A>

	getAggregateCopy(): A

	applyEvent(event: E): void
	getCurrentVersion(): number
}

/**
 * Small util for managing some class state(the aggregate) using series of events.
 * 
 * @deprecated This event sourcing stuff is not supported and shouldn't be used.
 */
export interface EventSourcing<A, E> extends NoHistoryEventSourcing<A, E> {
	getEvents(): Iterable<E>
	popEvent(): E | null
}