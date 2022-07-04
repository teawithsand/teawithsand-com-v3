const innerCanUseDom =
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement

export const canUseDom = () => innerCanUseDom
export const isSSR = () => !canUseDom()

export const requireNoSSR = () => {
	if (!canUseDom()) throw new Error("This function does not work with SSR")
}
