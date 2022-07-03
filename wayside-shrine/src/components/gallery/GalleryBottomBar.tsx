import { GalleryEntry } from "@app/components/gallery/Gallery"
import React from "react"
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
	grid-auto-columns: minmax(10%, 33%);
	gap: 0.8rem;

	user-select: none;
	::selection {
		background: transparent;
	}
	touch-action: none;
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

const GalleryBottomBarItem = (props: { entry: GalleryEntry }) => {
	const { entry } = props
	return (
		<GalleryBottomBarItemContainer>{entry}</GalleryBottomBarItemContainer>
	)
}

// eslint-disable-next-line react/display-name
export const GalleryBottomBar = React.forwardRef(
	(
		props: {
			entries: GalleryEntry[]
			itemHeight: number | null
		},
		ref,
	) => {
		return (
			<InnerGalleryBottomBar
				// these lines are ok
				// despite the fact that any cast is needed
				ref={ref as any}
				$itemHeight={props.itemHeight}
			>
				{props.entries.map((v, i) => (
					<GalleryBottomBarItem entry={v} key={i} />
				))}
			</InnerGalleryBottomBar>
		)
	},
)
