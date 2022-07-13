import { useEffect, useState } from "react";
import { requireNoSSR } from "tws-common/ssr";


export type Orientation = "vertical" | "horizontal" | "square"

/**
 * @deprecated. It's using document's width and window's height.
 */
export type UsefulDimensions = {
	width: number
	height: number
	orientation: Orientation
}

/**
 * @deprecated. It's using document's width and window's height.
 */
export const getUsefulDimensions = () => {
	const { clientWidth: width } = document.body
	const { innerHeight: height } = window

	let orientation: Orientation = "square"
	if (width > height) {
		orientation = "horizontal"
	} else if (height > width) {
		orientation = "vertical"
	}
	return {
		width,
		height,
		orientation,
	}
}

/**
 * @deprecated. It's using document's width and window's height.
 */
export default function useUsefulDimensions(): UsefulDimensions {
	requireNoSSR()

	const [windowDimensions, setWindowDimensions] = useState(
		getUsefulDimensions(),
	)

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getUsefulDimensions())
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return windowDimensions
}