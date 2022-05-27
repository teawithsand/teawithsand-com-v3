import { concatArrayBuffers } from "@app/util/lang/arrayBuffer"

export const collectReadableStream = async (
	s: ReadableStream<ArrayBufferLike>,
): Promise<ArrayBuffer> => {
	const rd = s.getReader()
	const buffers: ArrayBufferLike[] = []
	for (;;) {
		const { value, done } = await rd.read()
		if (done) {
			return concatArrayBuffers(...buffers)
		}
		buffers.push(value)
	}
}
