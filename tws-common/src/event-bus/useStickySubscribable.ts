import { useEffect, useState } from "react"
import { StickySubscribable } from "tws-common/event-bus/subscribable"

export const useStickySubscribable = <T>(
	subscribable: StickySubscribable<T>,
): T => {
	const [lastEvent, setLastEvent] = useState(subscribable.lastEvent)
	useEffect(() => {
		setLastEvent(subscribable.lastEvent)
		const releaser = subscribable.addSubscriber(event => {
			setLastEvent(event)
		})

		return () => {
			releaser()
		}
	}, [subscribable])

	return lastEvent
}
