export const concatArrayBuffers = (
	...buffers: ArrayBufferLike[]
): ArrayBuffer => {
	let sz = 0
	for (const b of buffers) {
		sz += b.byteLength
	}

	const b = new ArrayBuffer(sz)
	const bv = new Uint8Array(b)
	let off = 0
	for (const buf of buffers) {
		bv.set(new Uint8Array(buf), off)
		off += buf.byteLength
	}

	return b
}
