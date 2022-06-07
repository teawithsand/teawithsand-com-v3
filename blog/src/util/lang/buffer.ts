export const arrayBufferFromBytes = (bytes: number[]): ArrayBuffer => {
	const b = new ArrayBuffer(bytes.length)
	const v = new Uint8Array(b)
	for (let i = 0; i < bytes.length; i++) {
		v[i] = bytes[i]
	}
	return b
}

export const randomBytesSync = (size: number): ArrayBuffer => {
	const MAX_LEN = 1024

	const buffer = new ArrayBuffer(size)
	let offset = 0
	for (;;) {
		if (offset === buffer.byteLength) break

		const sz = Math.min(MAX_LEN, buffer.byteLength - offset)
		const arr = new Uint8Array(buffer.slice(offset, offset + sz))

		crypto.getRandomValues(arr)
		offset += sz
	}
	return buffer
}
