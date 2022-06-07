import { useEffect, useState } from "react"

import { NoHistoryEventSourcing } from "tws-common/lang/eventSourcing"

/**
 * Subscribes to specified event sourcing using react.
 *
 * @deprecated use useStickySubscribable instead
 */
export default <A, E>(es: NoHistoryEventSourcing<A, E>): A => {
	// TODO(teawithsand): make it work with any event bus, not event sourcing

	const [aggregate, setAggregate] = useState(es.aggregate.lastEvent)

	useEffect(() => {
		const releaser = es.aggregate.addSubscriber(agg => {
			setAggregate(agg)
		})

		return () => {
			releaser()
		}
	}, [es])

	return aggregate
}
