import Metadata from "@app/util/player/metadata/Metadata"

export default class MetadataTool {
	loadMetadata = async (
		src:
			| string
			| {
					url: string
					release: () => void
			  },
	): Promise<Metadata> => {
		let url: string
		if (typeof src === "string") {
			url = src
		} else {
			url = src.url
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
								`Unknown error when loading metadata for ${url}`,
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
						new Error(`Timeout when loading metadata for ${url}`),
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
			if (typeof src === "object") src.release()
		}
	}
}
