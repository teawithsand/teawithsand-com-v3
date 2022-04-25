import { EventSourcing } from "@app/util/lang/eventSourcing"
import { useEffect, useState } from "react"

/**
 * Subscribes to specified event sourcing using react.
 */
export default <A, E>(es: EventSourcing<A, E>): A => {
    // TODO(teawithsand): make it work with any event bus, not event sourcing
    
    const [aggregate, setAggregate] = useState(es.aggregate.lastEvent)

    useEffect(() => {
        const releaser = es.aggregate.addSubscriber((agg) => {
            setAggregate(agg)
        })

        return () => {
            releaser()
        }
    }, [es])

    return aggregate
}