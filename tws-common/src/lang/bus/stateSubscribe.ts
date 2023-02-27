/**
 * @deprecated use one from event-bus top level package
 */

export type Subscriber<S> = (state: S) => void
/**
 * @deprecated use one from event-bus top level package
 */

export type DeltaSubscriber<S> = (previousState: S, newState: S) => void
/**
 * @deprecated use one from event-bus top level package
 */

export type Extractor<S, E> = (state: S) => E
/**
 * @deprecated use one from event-bus top level package
 */
export type SubscriptionCanceler = () => void

/**
 * @deprecated use one from event-bus top level package
 */
export interface StickySubscribable<T> extends Subscribable<T> {
	readonly lastEvent: T
}

// note: this should be replaced with rxjs
/**
 * Something, one can subscribe to.
 *
 * @deprecated use one from event-bus top level package
 */
export interface Subscribable<T> {
	addSubscriber(subscriber: Subscriber<T>): SubscriptionCanceler
}

/**
 * @deprecated use one from event-bus top level package
 */
export class StateSubscriptionManager<S> {
	private subscribers: Subscriber<S>[] = []
	constructor(private innerState: S) {}

	get state(): S {
		return this.state
	}

	/**
	 * Adds subscriber over extracted value, which is only called when value extracted by extractor changes.
	 */
	addExtractorSubscriber = <E>(
		extractor: Extractor<S, E>,
		subscriber: Subscriber<E>,
		comparator?: (lhs: E, rhs: E) => boolean,
	): SubscriptionCanceler => {
		const mustComparator = comparator ?? ((l, r) => l === r)

		let prevExtractedValue = extractor(this.innerState)
		const s: Subscriber<S> = (state: S) => {
			const newExtractedValue = extractor(state)

			if (!mustComparator(prevExtractedValue, newExtractedValue)) {
				subscriber(newExtractedValue)
				prevExtractedValue = newExtractedValue
			}
		}

		return this.addSubscriber(s)
	}

	addOnChangedSubscriber = <E>(
		extractor: Extractor<S, E>,
		subscriber: Subscriber<S>,
		comparator?: (lhs: E, rhs: E) => boolean,
	): SubscriptionCanceler => {
		const mustComparator = comparator ?? ((l, r) => l === r)

		let prevExtractedValue = extractor(this.innerState)
		const s: Subscriber<S> = (state: S) => {
			const newExtractedValue = extractor(state)

			if (!mustComparator(prevExtractedValue, newExtractedValue)) {
				subscriber(state)
				prevExtractedValue = newExtractedValue
			}
		}

		return this.addSubscriber(s)
	}

	addEagerOnChangedSubscriber = <E>(
		extractor: Extractor<S, E>,
		subscriber: Subscriber<S>,
		comparator?: (lhs: E, rhs: E) => boolean,
	): SubscriptionCanceler => {
		const mustComparator = comparator ?? ((l, r) => l === r)

		subscriber(this.state)

		let prevExtractedValue = extractor(this.innerState)
		const s: Subscriber<S> = (state: S) => {
			const newExtractedValue = extractor(state)

			if (!mustComparator(prevExtractedValue, newExtractedValue)) {
				subscriber(state)
				prevExtractedValue = newExtractedValue
			}
		}

		return this.addSubscriber(s)
	}

	addSubscriber = (subscriber: Subscriber<S>): SubscriptionCanceler => {
		this.subscribers.push(subscriber)

		return () => this.removeSubscriber(subscriber)
	}

	addEagerSubscriber = (subscriber: Subscriber<S>): SubscriptionCanceler => {
		subscriber(this.state)
		this.subscribers.push(subscriber)

		return () => this.removeSubscriber(subscriber)
	}

	private removeSubscriber = (subscriber: Subscriber<S>) => {
		const i = this.subscribers.findIndex(e => e === subscriber)
		if (i < 0) return // warn maybe?
		this.subscribers.splice(i, 1)
	}

	/**
	 * TODO(teawithsand): hide this method from public in other interfaces/classes, which export this class, via typescript interface.
	 */
	updateState = (updater: (state: S) => S) => {
		this.innerState = updater(this.innerState)
		this.onStateChanged(this.innerState)
	}

	private onStateChanged = (newState: S) => {
		this.subscribers.forEach(s => s(newState))
	}
}
