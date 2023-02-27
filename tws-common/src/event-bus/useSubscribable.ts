import { useEffect, useState } from "react"
import { Subscribable } from "tws-common/event-bus/subscribable"

export const useSubscribable = <T>(
	subscribable: Subscribable<T>,
	initialValue: T,
): T => {
	const [aggregate, setAggregate] = useState(() => initialValue)

	useEffect(() => {
		const releaser = subscribable.addSubscriber(event => {
			setAggregate(event)
		})

		return () => {
			releaser()
		}
	}, [subscribable])

	return aggregate
}

/**
 * Note: each time callback is changed, listener is re-triggered.
 * This may cause problems with sticky event bus as well as performance problems in general.
 * [useCallback] on callbacks passed here.
 */
export const useSubscribableCallback = <T>(
	subscribable: Subscribable<T>,
	callback: (event: T) => void,
) => {
	useEffect(() => {
		const releaser = subscribable.addSubscriber(event => {
			callback(event)
		})

		return () => {
			releaser()
		}
	}, [subscribable, callback])
}
