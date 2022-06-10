import KeyValueStore from "tws-common/keyvalue/KeyValueStore"
import Metadata from "tws-common/player/metadata/Metadata"
import MetadataLoader from "tws-common/player/metadata/MetadataLoader"
import PlayerSource from "tws-common/player/source/PlayerSource"

const getErrorDetails = (e: any): string => {
	return "Unknown error"
}

export class CachingMetadataLoader implements MetadataLoader {
	constructor(
		private readonly innerLoader: MetadataLoader,
		private readonly store: KeyValueStore<
			| {
					type: 1
					metadata: Metadata
			  }
			| {
					type: 2
					error: string
			  },
			string
		>,
		private readonly cacheErrors = false,
	) {}

	private getId = (src: string | PlayerSource) => {
		if (typeof src === "string") {
			return src
		} else {
			return src.id
		}
	}

	dropCachedEntry = async (src: string | PlayerSource): Promise<void> => {
		const id = this.getId(src)
		await this.store.delete(id)
	}

	storeEntryToCache = async (
		src: string | PlayerSource,
		metadata: Metadata,
	): Promise<void> => {
		const id = this.getId(src)
		await this.store.set(id, {
			type: 1,
			metadata,
		})
	}

	loadMetadata = async (src: string | PlayerSource): Promise<Metadata> => {
		const id = this.getId(src)

		const cached = await this.store.get(id)
		if (!cached) {
			try {
				const metadata = await this.innerLoader.loadMetadata(src)
				await this.store.set(id, {
					type: 1,
					metadata,
				})
				return metadata
			} catch (e) {
				if (this.cacheErrors) {
					const msg = getErrorDetails(e)
					this.store.set(id, {
						type: 2,
						error: msg,
					})
				}
				throw e
			}
		} else if (cached.type === 2) {
			throw new Error(`Metadata cached failure: ${cached.error}`)
		} else if (cached.type === 1) {
			return cached.metadata
		} else {
			throw new Error("unreachable code")
		}
	}
}
