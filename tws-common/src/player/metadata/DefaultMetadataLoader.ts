import Metadata from "tws-common/player/metadata/Metadata"
import MetadataLoader from "tws-common/player/metadata/MetadataLoader"
import PlayerSource, {
	obtainPlayerSourceURL,
} from "tws-common/player/source/PlayerSource"

export default class DefaultMetadataLoader implements MetadataLoader {
	loadMetadata = async (
		src: PlayerSource,
		maybeUrl?: string,
	): Promise<Metadata> => {
		let closer = () => {
			// noop
		}

		let url: string
		if (!maybeUrl) {
			;[url, closer] = await obtainPlayerSourceURL(src)
		} else {
			url = maybeUrl
		}

		try {
			const audio = new Audio()

			let errorListener: () => void
			let metadataListener: () => void
			const p = new Promise<Metadata>((resolve, reject) => {
				errorListener = () => {
					reject(
						audio.error ??
							new Error(
								`Unknown error when loading metadata for ${maybeUrl}`,
							),
					)
				}
				metadataListener = () => {
					let duration: number | null = audio.duration
					if (duration < 0 || !isFinite(duration)) duration = null

					resolve({
						duration,
					})
				}

				audio.addEventListener("error", errorListener)
				audio.addEventListener("stalled", errorListener)
				audio.addEventListener("loadedmetadata", metadataListener)

				const timeout = setTimeout(() => {
					reject(
						new Error(
							`Timeout when loading metadata for ${maybeUrl}`,
						),
					)
				}, 30 * 1000) // 30s is a lot of timeout btw

				try {
					audio.src = url
					audio.preload = "metadata"
					audio.volume = 0
					audio.pause()
					audio.load()
				} finally {
					clearTimeout(timeout)
				}
			}).finally(() => {
				audio.removeEventListener("error", errorListener)
				audio.removeEventListener("loadedmetadata", metadataListener)
			})

			audio.load()

			try {
				return await p
			} finally {
				audio.src = ""
				audio.load()
				audio.pause()
			}
		} finally {
			closer()
		}
	}
}
