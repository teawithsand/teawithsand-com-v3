import styled from "styled-components"
import React, { useRef, useState, useEffect } from "react"
import { GalleryEntry } from "@app/components/gallery/Gallery"

// TODO(teawithsand): optimize it so it does not has to generate classes for each screen size
//  that being said, it's ok to leave it as is, since users do not resize their screens that often(I guess...)
const GalleryMiddleBarItemContainer = styled.div`
	grid-row: 1;
	grid-column: 1;

	margin: auto;
	padding: 0; // this is required for proper usage of $itemHeight
	box-sizing: border-box;

	max-height: 100%;
	max-width: 100%;

	text-align: center;

	overflow: hidden; // just for safety, in case something goes wrong or image decides to ignore our max height

	& > * {
		box-sizing: border-box;
		max-height: var(--gallery-item-height);
	}
`

const InnerGalleryMiddleBar = styled.div.attrs(
	({ $itemHeight }: { $itemHeight: number | null }) => ({
		style: {
			"--gallery-item-height": $itemHeight ? `${$itemHeight}px` : "0px",
		},
	}),
)`
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
`

const GalleryMiddleBarItem = (props: { entry: GalleryEntry }) => {
	const { entry } = props
	return (
		<GalleryMiddleBarItemContainer>{entry}</GalleryMiddleBarItemContainer>
	)
}

const GalleryMiddleBar = (props: { entries: GalleryEntry[] }) => {
	const ref = useRef<HTMLDivElement | null>(null)
	const [dimensions, setDimensions] = useState<[number, number] | null>(null)

	useEffect(() => {
		const { current } = ref
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setDimensions([width, height])
			})
			observer.observe(current)
			return () => {
				observer.unobserve(current)
			}
		}
	}, [ref, ref.current])

	return (
		<InnerGalleryMiddleBar
			// these lines are ok
			// despite the fact that any cast is needed
			ref={ref as any}
			$itemHeight={dimensions ? dimensions[1] : null}
		>
			{props.entries.map((v, i) => (
				<GalleryMiddleBarItem entry={v} key={i} />
			))}
		</InnerGalleryMiddleBar>
	)
}

export default GalleryMiddleBar
