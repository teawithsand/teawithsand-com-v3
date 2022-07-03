import React from "react"
import styled from "styled-components"

const InnerGalleryTopBar = styled.div.attrs(
	({ $visible }: { $visible: boolean }) => ({
		style: {
			...(!$visible ? { display: "none" } : {}),
		},
	}),
)`
	grid-row: 1;
	grid-column: 1;
	text-align: center;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
`

const GalleryTopBar = (props: { visible?: boolean }) => {
	const { visible } = props
	return (
		<InnerGalleryTopBar
			{...({
				$visible: visible ?? true,
			} as any)}
		>
			Top Bar
		</InnerGalleryTopBar>
	)
}

export default GalleryTopBar
