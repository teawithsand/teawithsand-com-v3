import GalleryBottomBar from "@app/components/gallery/GalleryBottomBar"
import GalleryMiddleBar from "@app/components/gallery/GalleryMiddleBar"
import GalleryTopBar from "@app/components/gallery/GalleryTopBar"
import React, { ReactNode, useMemo } from "react"
import styled from "styled-components"

export type GalleryEntry = ReactNode

const GalleryContainer = styled.div.attrs(
	(props: { $galleryHeight: string }) => ({
		style: {
			height: props.$galleryHeight,
		},
	}),
)`
	display: grid;
	grid-template-columns: auto;
	// Note: middle row(the one with elements) has to have height defined independently of it's content
	// so JS measuring code works
	grid-template-rows: minmax(min-content, 0fr) minmax(0, 1fr) 100px;

	background-color: black;
	border-radius: 5px;
	color: white;
	padding: 5px;

	// Bunch of global styles
	// to fix gatsby stuff
	& .gatsby-image-wrapper [data-main-image] {
		will-change: initial !important;
	}

	// Some special stuff for better gatsby images
	& img,
	& *.gatsby-image-wrapper > img,
	& *.gatsby-image-wrapper > picture > img {
		image-rendering: auto;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: smooth;
		image-rendering: high-quality;
	}
`

const Gallery = (props: { children: GalleryEntry[] | GalleryEntry }) => {
	const { children } = props

	const arrayChildren = useMemo(() => {
		return children instanceof Array ? children : [children]
	}, [children])

	return (
		<GalleryContainer $galleryHeight="80vh">
			<GalleryTopBar />
			<GalleryMiddleBar entries={arrayChildren} />
			<GalleryBottomBar entries={arrayChildren} />
		</GalleryContainer>
	)
}

export default Gallery
