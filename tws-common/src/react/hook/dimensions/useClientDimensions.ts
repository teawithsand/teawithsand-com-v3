import { useEffect, useState } from "react"
import { requireNoSSR } from "tws-common/ssr"

export type Orientation = "vertical" | "horizontal" | "square"
export type ClientDimensions = {
	width: number
	height: number
	orientation: Orientation
}

export const getClientDimensions = () => {
	const { clientWidth: width, clientHeight: height } = document.body

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

export default function useClientDimensions(): ClientDimensions {
	requireNoSSR()

	const [windowDimensions, setWindowDimensions] = useState(
		getClientDimensions(),
	)

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getClientDimensions())
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return windowDimensions
}
