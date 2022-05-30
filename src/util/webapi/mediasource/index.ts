export const isMimeSupported = (codec: string) =>
	MediaSource.isTypeSupported(codec)

// For now this serves as a hack
// so service-worker based serving of parts is not used.
export const mediaSourceFromReader = (
	stream: ReadableStream<ArrayBuffer>,
	codec: string,
) => {
	const reader = stream.getReader()

	const mediaSource = new MediaSource()

	let closed = false

	mediaSource.addEventListener("sourceopen", () => {
		const buffer = mediaSource.addSourceBuffer(codec)

		;(async () => {
			for (;;) {
				const { done, value } = await reader.read()
				if (closed || done) break
				buffer.appendBuffer(value)
			}
		})()
	})
	mediaSource.addEventListener("sourceclose", () => {
		closed = true
	})
}
