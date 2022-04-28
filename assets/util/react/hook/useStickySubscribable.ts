import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"
import { useEffect, useState } from "react"

/**
 * Subscribes to specified StickySubscribable using react.
 */
export default <A>(subscribable: StickySubscribable<A>): A => {
    // TODO(teawithsand): make it work with any event bus, not event sourcing
    
    const [aggregate, setAggregate] = useState(subscribable.lastEvent)
    useEffect(() => {
        setAggregate(subscribable.lastEvent)
        const releaser = subscribable.addSubscriber((agg) => {
            setAggregate(agg)
        })

        return () => {
            releaser()
        }
    }, [subscribable])

    return aggregate
}