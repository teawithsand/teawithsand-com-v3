/**
 * A source, which can be played.
 * It's more of an interface, but it's implemented as a class, so downcasting(which is required to support all types of sources)
 * is easier.
 *
 * Source can be closed, which releases any resources associated with it.
 */
abstract class PlayerSource {
}

/**
 * Simple source, which is just an URL.
 * It has noop closer.
 */
export class URLPlayerSource extends PlayerSource {
	constructor(public readonly url: string) {
		super()
	}
}

export default PlayerSource
