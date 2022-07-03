import Gallery, {
	GalleryEntry,
	GalleryMode,
	GallerySize,
} from "@app/components/gallery/Gallery"
import React, { useState } from "react"

export type AutonomousGalleryProps = {
	entries: GalleryEntry[]
}

const AutonomousGallery = (props: AutonomousGalleryProps) => {
	const { entries } = props

	const [mode, setMode] = useState<GalleryMode>("normal")
	const [size, setSize] = useState<GallerySize>("large")
	const [elementIndex, setElementIndex] = useState(0)

	const effectiveElementIndex =
		elementIndex < entries.length ? elementIndex : 0

	if (entries.length === 0) return <></>
	return (
		<Gallery
			entries={entries}
			currentEntryIndex={effectiveElementIndex}
			mode={mode}
			size={size}
			onCurrentEntryTap={() => {
				if (size === "large") {
					setSize("fullscreen")
				} else if (size === "fullscreen" && mode === "normal") {
					setMode("image-only")
				} else {
					setSize("large")
					setMode("normal")
				}
			}}
			onSwipeRight={() => {
				setElementIndex((effectiveElementIndex + 1) % entries.length)
			}}
			onSwipeLeft={() => {
				setElementIndex(
					effectiveElementIndex - 1 >= 0
						? effectiveElementIndex - 1
						: entries.length - 1,
				)
			}}
			onSwipeTop={() => {
				setMode("normal")
			}}
			onSwipeBottom={() => {
				setMode("image-only")
			}}
			onBottomEntryTap={i => {
				setElementIndex(i)
			}}
		/>
	)
}

export default AutonomousGallery
