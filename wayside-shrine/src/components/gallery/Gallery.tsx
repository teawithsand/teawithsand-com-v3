import React, { ReactNode } from "react"
import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import styled from "styled-components"

export type GalleryEntry = ReactNode

const GalleryContainer = styled.div`
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: minmax(min-content, 0fr) minmax(0, 1fr) minmax(
			min-content,
			0fr
		);

	// gallery requires some fixed height. I couldn't make it work with max-height.
	// max-height works on element presentation though
	height: 80vh;

	border: 3px solid purple;
`

const GalleryItemsContainer = styled.div`
	grid-row: 2;
	grid-column: 1;

	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;

	box-sizing: border-box;
	padding: 0; // required, since we are are using JS to measure this element's dimensions.
	// margin: 0; // margins are fine though

	width: 100%; // required, since we are are using JS to measure this element's dimensions.
	height: 100%; // required, since we are are using JS to measure this element's dimensions.

	border: 3px solid blue;
`

// TODO(teawithsand): optimize it so it does not has to generate classes for each screen size
//  that being said, it's ok to leave it as is, since users do not resize their screens that often(I guess...)
const GalleryItemContainer = styled.div`
	grid-row: 1;
	grid-column: 1;

	margin: auto;
	padding: 0; // this is required for proper usage of $itemHeight
	box-sizing: border-box;

	max-height: 100%;
	max-width: 100%;

    overflow: hidden; // just for safety, in case something goes wrong or image decides to ignore our max height

	& > * {
		box-sizing: border-box;
		max-height: ${({ $itemHeight }) =>
			$itemHeight ? `${$itemHeight}px` : "0px"};
	}
`

const GalleryTopBar = styled.div`
	grid-row: 1;
	grid-column: 1;
	text-align: center;
`

const GalleryBottomBar = styled.div`
	grid-row: 3;
	grid-column: 1;
	text-align: center;
`

const GalleryItem = (props: {
	entry: GalleryEntry
	height?: number | null
}) => {
	const { entry, height } = props
	return (
		<GalleryItemContainer $itemHeight={height ?? null}>
			{entry}
		</GalleryItemContainer>
	)
}

const Gallery = (props: { children: GalleryEntry[] | GalleryEntry }) => {
	const { children } = props

	const itemsContainerRef = useRef<HTMLDivElement | null>(null)
	const [galleryItemsContainerDimensions, setGalleryItemsContainerDimensions] = useState<[number, number] | null>(null)
	useEffect(() => {
		const { current } = itemsContainerRef
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setGalleryItemsContainerDimensions([width, height])
			})
			observer.observe(current)
			return () => {
				observer.unobserve(current)
			}
		}
	}, [itemsContainerRef, itemsContainerRef.current])

	return (
		<GalleryContainer>
			<GalleryTopBar>Hell world! I am top bar!</GalleryTopBar>
			<GalleryItemsContainer ref={itemsContainerRef}>
				{(children instanceof Array ? children : [children]).map(
					(v, i) => (
						<GalleryItem
							entry={v}
							key={i}
							height={galleryItemsContainerDimensions ? galleryItemsContainerDimensions[1] : null}
						/>
					),
				)}
			</GalleryItemsContainer>
            <GalleryBottomBar >I am gallery bottom bar</GalleryBottomBar>
		</GalleryContainer>
	)
}

export default Gallery
