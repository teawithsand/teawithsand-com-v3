import { GalleryEntry } from "@app/components/gallery/Gallery"
import React, { useRef, useState, useEffect } from "react"
import styled from "styled-components"

const InnerGalleryBottomBar = styled.div.attrs(
	({ $itemHeight }: { $itemHeight: number | null }) => ({
		style: {
			"--gallery-item-height": $itemHeight ? `${$itemHeight}px` : "0px",
		},
	}),
)`
	grid-row: 3;
	grid-column: 1;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;

	overflow-x: visible;
	overflow-y: hidden;

	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: minmax(15%, 33%);
	gap: 0.8rem;

	// Make items non selectable and prevent fancy stuff with touch-action: none
	& * {
		user-select: none;
		::selection {
			background: transparent;
		}
		touch-action: none;

		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}

	// Make all scrollbar pretty
	& {
		&::-webkit-scrollbar {
			height: 6px;
			width: 6px;
			background: black;
		}

		&::-webkit-scrollbar-thumb {
			background: white;
			border-radius: 12px;
			box-shadow: 0px 1px 2px rgba(255, 255, 255, 0.75);
		}

		&::-webkit-scrollbar-corner {
			background: black;
		}

		scrollbar-color: white black;
		scrollbar-width: thin;

		scroll-behavior: smooth;
	}
`

// TODO(teawithsand): optimize it so it does not has to generate classes for each screen size
//  that being said, it's ok to leave it as is, since users do not resize their screens that often(I guess...)
const GalleryBottomBarItemContainer = styled.div`
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

const GalleryBottomBarItem = (props: { entry: ReactNode }) => {
	const { entry } = props
	return (
		<GalleryBottomBarItemContainer>{entry}</GalleryBottomBarItemContainer>
	)
}

const GalleryBottomBar = (props: { entries: ReactNode[] }) => {
	const ref = useRef<HTMLDivElement | null>(null)
	const [dimensions, setDimensions] = useState<[number, number] | null>(null)

	const newTargetScroll = useRef(0)

	useEffect(() => {
		const { current } = ref
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setDimensions([width, height])
			})
			observer.observe(current)

			newTargetScroll.current = current.scrollLeft

			current.addEventListener("wheel", e => {
				e.preventDefault()

				// or make single scroll pull single image to view
				// can be easily done using scrollToView method
				newTargetScroll.current = Math.max(
					0,
					Math.min(
						newTargetScroll.current + e.deltaY,
						current.scrollWidth,
					),
				)
				current.scrollLeft = newTargetScroll.current
			})

			return () => {
				observer.unobserve(current)
			}
		}
	}, [ref, ref.current])

	return (
		<InnerGalleryBottomBar
			ref={ref}
			$itemHeight={dimensions ? dimensions[1] : null}
		>
			{props.entries.map((v, i) => (
				<GalleryBottomBarItem entry={v} key={i} />
			))}
		</InnerGalleryBottomBar>
	)
}
export default GalleryBottomBar
