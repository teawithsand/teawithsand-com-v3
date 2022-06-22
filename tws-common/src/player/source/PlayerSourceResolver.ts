import { PlayerSource } from "tws-common/player/source/PlayerSource"

export type PlayerSourceResolver<T extends PlayerSource> = {
	/**
	 * Resolves player source into URL, which should be released once it's not needed.
	 */
	resolveSourceToURL(source: T): Promise<[string, () => void]>
	resolveSourceToBlob(source: T): Promise<[Blob | File, () => void]>
}

export type BasePlayerSourceResolverExtractedData = (
	| {
			type: "blob"
			blob: Blob
	  }
	| {
			type: "url"
			url: string
	  }
) & {
	id: string
}

export abstract class BasePlayerSourceResolver<T extends PlayerSource>
	implements PlayerSourceResolver<T>
{
	private readonly cachedObjectURLs: Map<
		string,
		{
			url: string
			release: () => void
			counter: number
		}
	> = new Map()

	private readonly cachedBlobs: Map<
		string,
		{
			value: Blob | File
			counter: number
		}
	> = new Map()

	private getCachedBlob = async (
		id: string,
		blobLoader: () => Promise<Blob | File>,
	): Promise<[Blob | File, () => void]> => {
		if (!this.cachedBlobs.has(id)) {
			this.cachedBlobs.set(id, {
				counter: 1,
				value: await blobLoader(),
			})
		}

		const cached = this.cachedBlobs.get(id)
		if (!cached) throw new Error("unreachable code")

		cached.counter += 1
		let closed = false
		return [
			cached.value,
			() => {
				if (!closed) {
					cached.counter -= 1
					closed = true

					if (cached.counter === 0) {
						this.cachedBlobs.delete(id)
					}
				}
			},
		]
	}

	private getCachedObjectURL = (
		id: string,
		blob: Blob | File | MediaSource,
	): [string, () => void] => {
		if (!this.cachedObjectURLs.has(id)) {
			const url = URL.createObjectURL(blob)
			this.cachedObjectURLs.set(id, {
				counter: 1,
				release: () => {
					URL.revokeObjectURL(url)
				},
				url,
			})
		}

		const cached = this.cachedObjectURLs.get(id)
		if (!cached) throw new Error("unreachable code")

		cached.counter += 1
		let closed = false
		return [
			cached.url,
			() => {
				if (!closed) {
					cached.counter -= 1
					closed = true

					if (cached.counter === 0) {
						cached.release()
						this.cachedObjectURLs.delete(id)
					}
				}
			},
		]
	}

	protected abstract extractData(
		source: T,
	): BasePlayerSourceResolverExtractedData

	resolveSourceToBlob = async (
		source: T,
	): Promise<[Blob | File, () => void]> => {
		const data = this.extractData(source)
		if (data.type === "url") {
			return this.getCachedBlob(data.id, () =>
				fetch(data.url).then(r => r.blob()),
			)
		} else if (data.type === "blob") {
			return [
				data.blob,
				() => {
					// noop
				},
			]
		} else {
			throw new Error("unreachable code")
		}
	}

	resolveSourceToURL = async (source: T): Promise<[string, () => void]> => {
		const data = this.extractData(source)
		if (data.type === "url") {
			return [
				data.url,
				() => {
					// noop
				},
			]
		} else if (data.type === "blob") {
			return this.getCachedObjectURL(data.id, data.blob)
		} else {
			throw new Error("unreachable code")
		}
	}
}
