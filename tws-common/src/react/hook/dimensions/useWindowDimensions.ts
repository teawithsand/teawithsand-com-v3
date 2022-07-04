import { useEffect, useState } from "react";
import { requireNoSSR } from "tws-common/ssr";


export type Orientation = "vertical" | "horizontal" | "square"
export type WindowDimensions = {
	width: number
	height: number
	orientation: Orientation
}

export const getWindowDimensions = (): WindowDimensions => {
	const { innerWidth: width, innerHeight: height } = window
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

export default function useWindowDimensions(): WindowDimensions {
	requireNoSSR()

	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions(),
	)

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions())
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return windowDimensions
}