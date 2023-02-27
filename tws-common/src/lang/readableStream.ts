import { concatArrayBuffers } from "tws-common/lang/arrayBuffer"

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

export async function* iterateOverReader<T>(reader: ReadableStreamReader<T>) {
	for (;;) {
		const { value, done } = await reader.read()
		if (done) {
			return
		}
		yield value
	}
}
