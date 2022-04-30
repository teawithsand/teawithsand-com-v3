import { useEffect, useState } from "react"

export type Orientation = "vertical" | "horizontal" | "square"
export type UsefulDimensions = {
	width: number
	height: number
	orientation: Orientation
}

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

export default function useUsefulDimensions(): UsefulDimensions {
	const [windowDimensions, setWindowDimensions] = useState(
		getUsefulDimensions()
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
