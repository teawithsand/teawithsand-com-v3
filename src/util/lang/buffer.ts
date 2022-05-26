export const arrayBufferFromBytes = (bytes: number[]): ArrayBuffer => {
	const b = new ArrayBuffer(bytes.length)
	const v = new Uint8Array(b)
	for (let i = 0; i < bytes.length; i++) {
		v[i] = bytes[i]
	}
	return b
}
