import PlayerSource, { BlobPlayerSource, FunctionPlayerSource, URLPlayerSource } from "tws-common/player/source/PlayerSource";
import PlayerSourceError from "tws-common/player/source/PlayerSourceError";


/**
 * Util, which takes source and makes URLs from it.
 */
export default interface PlayerSourceResolver {
	obtainURL(source: PlayerSource): Promise<[string, () => void]>
}

export class DefaultPlayerSourceResolver implements PlayerSourceResolver {
	private readonly cachedSourcesIds: Map<
		string,
		{
			url: string
			release: () => void
			counter: number
		}
	> = new Map()

	private getCachedURL = (
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

	obtainURL = async (source: PlayerSource): Promise<[string, () => void]> => {
		if (source instanceof URLPlayerSource) {
			return [
				source.url,
				() => {
					/*noop*/
				},
			]
		} else if (source instanceof BlobPlayerSource) {
			return this.getCachedURL(source.id, source.blob)
		} else if (source instanceof FunctionPlayerSource) {
			try {
				const blob = await source.blobGetter()
				return this.getCachedURL(source.id, blob)
			} catch (e) {
				throw new PlayerSourceError(
					`Filed to resolve FunctionPlayerSource: ${e}`,
				)
			}
		} else {
			throw new PlayerSourceError(`Unsupported player source: ${source}`)
		}
	}
}


export const DEFAULT_PLAYER_SOURCE_RESOLVER = new DefaultPlayerSourceResolver()