import { generateUUID } from "tws-common/lang/uuid"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

/**
 * A source, which can be played.
 * It's more of an interface, but it's implemented as a class, so downcasting(which is required to support all types of sources)
 * is easier.
 *
 * Source can be closed, which releases any resources associated with it.
 */
export abstract class PlayerSource {
	abstract equals(b: PlayerSource): boolean
	abstract id: string
}

export type LoginPlayerSourceContent =
	| {
			type: "urlObject"
			data: Blob | File | MediaSource
	  }
	| {
			type: "url"
			url: string
	  }

export abstract class LoadingPlayerSource extends PlayerSource {
	abstract loadTarget(): Promise<LoginPlayerSourceContent>
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
		return "url:" + this.url
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof URLPlayerSource && b.url === this.url
	}
}

export class BlobPlayerSource extends PlayerSource {
	constructor(
		public readonly blob: Blob | MediaSource | File,
		public readonly innerId: string = generateUUID(),
	) {
		super()
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof BlobPlayerSource && b.innerId === this.innerId
	}

	get id(): string {
		return "blb:" + this.id
	}
}

// TODO(teawithsand): optimize this to have only single instance of blob/file available at a time
//  preferably, using some counter of how many users use it and release when it gets to zero
export class FunctionPlayerSource extends PlayerSource {
	constructor(
		public readonly blobGetter: () => Promise<Blob | File>,
		public readonly innerId: string = generateUUID(),
	) {
		super()
	}

	equals = (b: PlayerSource): boolean => {
		return b instanceof FunctionPlayerSource && b.innerId === this.innerId
	}

	get id(): string {
		return "fcn:" + this.id
	}
}

export default PlayerSource

export type PlayerSourceWithMetadata = {
	playerSource: PlayerSource
	metadata: MetadataLoadingResult | null
}
