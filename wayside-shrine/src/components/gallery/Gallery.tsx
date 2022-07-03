import GalleryBottomBar from "@app/components/gallery/GalleryBottomBar"
import GalleryMiddleBar from "@app/components/gallery/GalleryMiddleBar"
import GalleryTopBar from "@app/components/gallery/GalleryTopBar"
import React, { ReactNode, useEffect, useMemo } from "react"
import styled from "styled-components"
import { useFullscreen } from "tws-common/react/hook/useFullscreen"

const GalleryContainer = styled.div.attrs(
	(props: {
		$galleryHeight: string
		$fullscreen: boolean
		$isMiddleOnly: boolean
	}) => ({
		style: {
			height: props.$galleryHeight,
			...(props.$fullscreen
				? {
						position: "fixed",
						zIndex: 1000,
						width: "100vw",
						height: "100vh",
						top: 0,
						left: 0,
						borderRadius: 0, // otherwise user is able to see background of body in corners
				  }
				: {}),
		},
	}),
)`
	display: grid;
	grid-template-columns: auto;
	// Note: middle row(the one with elements) has to have height defined independently of it's content
	// so JS measuring code works
	grid-template-rows: ${({ $isMiddleOnly }: { $isMiddleOnly: boolean }) =>
		$isMiddleOnly
			? "minmax(min-content, 0fr)"
			: "minmax(min-content, 0fr) minmax(100px, 1fr) 100px"};

	background-color: black;
	border-radius: 5px;
	color: white;
	padding: 5px;

	// Bunch of global styles
	// to fix gatsby stuff
	& .gatsby-image-wrapper [data-main-image] {
		will-change: initial !important;
	}

	& img,
	& *.gatsby-image-wrapper > img,
	& *.gatsby-image-wrapper > picture > img {
		image-rendering: auto;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: smooth;
		image-rendering: high-quality;
	}
`

export type GallerySize = "large" | "fullscreen"
export type GalleryMode = "normal" | "image-only"

export type GalleryEntry = {
	mainDisplay: ReactNode
}

export type GalleryProps = {
	entries: GalleryEntry[]
	currentEntryIndex: number
	size: GallerySize
	mode: GalleryMode
	onCurrentEntryTap: () => void
	onBottomEntryTap: (to: number) => void
	onSwipeRight: () => void
	onSwipeLeft: () => void
	onSwipeTop: () => void
	onSwipeBottom: () => void
}

const Gallery = (props: GalleryProps) => {
	const {
		entries,
		currentEntryIndex,
		onBottomEntryTap,
		onSwipeRight,
		onSwipeLeft,
		onSwipeTop,
		onSwipeBottom,
		onCurrentEntryTap,
		size,
		mode,
	} = props

	const mappedEntries = useMemo(
		() => entries.map(e => e.mainDisplay),
		[entries],
	)

	const fsc = useFullscreen({})

	useEffect(() => {
		if (size === "fullscreen") {
			fsc.enter()
		} else {
			fsc.exit()
		}
	}, [size])

	const getHeight = () => {
		if (fsc.isFullscreen || size === "fullscreen") {
			return "100vh"
		} else if (size === "large") {
			return "80vh"
		} else {
			throw new Error("unreachable code")
		}
	}

	return (
		<GalleryContainer
			{...({
				$galleryHeight: getHeight(),
				$fullscreen: fsc.isFullscreen || size === "fullscreen",
				$isMiddleOnly: mode !== "normal",
			} as any)}
		>
			{mode === "normal" ? <GalleryTopBar /> : null}
			<GalleryMiddleBar
				entries={mappedEntries}
				currentItemIndex={currentEntryIndex}
				onTap={onCurrentEntryTap}
				onSwipe={direction => {
					if (direction === "left") {
						onSwipeLeft()
					} else if (direction === "right") {
						onSwipeRight()
					} else if (direction === "top") {
						onSwipeTop()
					} else if (direction === "bottom") {
						onSwipeBottom()
					}
				}}
			/>
			{mode === "normal" ? (
				<GalleryBottomBar
					entries={mappedEntries}
					onElementClick={onBottomEntryTap}
					currentEntryIndex={currentEntryIndex}
				/>
			) : null}
		</GalleryContainer>
	)
}

export default Gallery
