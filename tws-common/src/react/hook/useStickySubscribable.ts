import { useEffect, useState } from "react"
import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"

/**
 * Subscribes to specified StickySubscribable using react.
 */
export const useStickySubscribable = <T>(
	subscribable: StickySubscribable<T>,
): T => {
	// TODO(teawithsand): make it work with any event bus, not event sourcing

	const [aggregate, setAggregate] = useState(subscribable.lastEvent)
	useEffect(() => {
		setAggregate(subscribable.lastEvent)
		const releaser = subscribable.addSubscriber(agg => {
			setAggregate(agg)
		})

		return () => {
			releaser()
		}
	}, [subscribable])

	return aggregate
}

export default useStickySubscribable
