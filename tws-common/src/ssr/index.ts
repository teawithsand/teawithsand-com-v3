const innerCanUseDom =
	typeof window !== "undefined" &&
	window.document &&
	window.navigator &&
	window.document.createElement

export const canUseDom = () => innerCanUseDom
export const isSSR = () => !canUseDom()

export const requireNoSSR = () => {
	if (!canUseDom()) {
		throw new Error("This function does not work with SSR")
		// TODO(teawithsand): here we should have access to node APIs, so we can write file with note or sth
	}
}
