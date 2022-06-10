/**
 * A source, which can be played.
 * It's more of an interface, but it's implemented as a class, so downcasting(which is required to support all types of sources)
 * is easier.
 *
 * Source can be closed, which releases any resources associated with it.
 */
abstract class PlayerSource {
	abstract equals(b: PlayerSource): boolean
	abstract id: string
}

/**
 * Simple source, which is just an URL.
 * It has noop closer.
 */
export class URLPlayerSource extends PlayerSource {
	constructor(public readonly url: string) {
		super()
	}

	get id() {
		return this.url
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof URLPlayerSource && b.url === this.url
	}
}

export class BlobPlayerSource extends PlayerSource {
	constructor(
		public readonly blob: Blob | MediaSource | File,
		public readonly innerId: string,
	) {
		super()
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof BlobPlayerSource && b.innerId === this.innerId
	}

	get id(): string {
		return this.id
	}
}

export class FunctionPlayerSource extends PlayerSource {
	constructor(
		public readonly blobGetter: () => Promise<Blob | File>,
		public readonly innerId: string,
	) {
		super()
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof FunctionPlayerSource && b.innerId === this.innerId
	}

	get id(): string {
		return this.id
	}
}

export default PlayerSource

export const obtainPlayerSourceURL = async (
	src: PlayerSource,
): Promise<[string, () => void]> => {
	if (src instanceof URLPlayerSource) {
		return [
			src.url,
			() => {
				// noop
			},
		]
	} else if (src instanceof BlobPlayerSource) {
		const url = URL.createObjectURL(src.blob)
		let isClosed = false
		return [
			url,
			() => {
				if (!isClosed) {
					URL.revokeObjectURL(url)
					isClosed = true
				}
			},
		]
	} else if (src instanceof FunctionPlayerSource) {
		const blob = await src.blobGetter()

		const url = URL.createObjectURL(blob)
		let isClosed = false
		return [
			url,
			() => {
				if (!isClosed) {
					URL.revokeObjectURL(url)
					isClosed = true
				}
			},
		]
	} else {
		throw new Error(`Unknown player source: ${src}`)
	}
}
