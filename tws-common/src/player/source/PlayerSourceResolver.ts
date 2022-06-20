import { PlayerSource } from "tws-common/player/source/PlayerSource"

export type PlayerSourceResolver<T extends PlayerSource> = {
	/**
	 * Resolves player source into URL, which should be released once it's not needed.
	 */
	resolveSourceToURL(source: T): Promise<[string, () => void]>
}

export abstract class NewPlayerSourceResolverImpl<T extends PlayerSource>
	implements PlayerSourceResolver<T>
{
	private readonly cachedSourcesIds: Map<
		string,
		{
			url: string
			release: () => void
			counter: number
		}
	> = new Map()

	private getURLCached = (id: string, url: string): [string, () => void] => {
		if (!this.cachedSourcesIds.has(id)) {
			this.cachedSourcesIds.set(id, {
				counter: 1,
				release: () => {
					// noop, we do not release URLs
				},
				url,
			})
		}

		const cached = this.cachedSourcesIds.get(id)
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
						this.cachedSourcesIds.delete(id)
					}
				}
			},
		]
	}

	private getCachedBlobURL = (
		id: string,
		blob: Blob | File | MediaSource,
	): [string, () => void] => {
		if (!this.cachedSourcesIds.has(id)) {
			const url = URL.createObjectURL(blob)
			this.cachedSourcesIds.set(id, {
				counter: 1,
				release: () => {
					URL.revokeObjectURL(url)
				},
				url,
			})
		}

		const cached = this.cachedSourcesIds.get(id)
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
						this.cachedSourcesIds.delete(id)
					}
				}
			},
		]
	}

	protected abstract extractData(source: T): (
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
			return this.getCachedBlobURL(data.id, data.blob)
		} else {
			throw new Error("unreachable code")
		}
	}
}
