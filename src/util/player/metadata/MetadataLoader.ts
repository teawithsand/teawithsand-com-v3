export type Metadata = {
	duration: number | null
}

export default class MetadataLoader {
	loadMetadata = async (
		src:
			| string
			| {
					url: string
					release: () => void
			  },
	) => {
		let url
		if (typeof src === "string") {
			url = src
		} else {
			url = src.url
		}
		try {
			const audio = new Audio()
			audio.src = url
			audio.preload = "metadata"
			audio.volume = 0
			audio.pause()

			let errorListener: () => void
			let metadataListener: () => void
			const p = new Promise((resolve, reject) => {
				errorListener = () => {
					reject(audio.error)
				}
				metadataListener = () => {
					let duration: number | null = audio.duration
					if (duration < 0 || !isFinite(duration)) duration = null

					resolve({
						duration,
					})
				}
			}).finally(() => {
				audio.removeEventListener("error", errorListener)
				audio.removeEventListener("loadedmetadata", metadataListener)
			})

			audio.load()

			try {
				await p
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
