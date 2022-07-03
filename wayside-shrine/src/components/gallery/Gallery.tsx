import { GalleryBottomBar } from "@app/components/gallery/GalleryBottomBar"
import { GalleryMiddleBar } from "@app/components/gallery/GalleryMiddleBar"
import React, { ReactNode, useMemo } from "react"
import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"
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

const GalleryTopBar = styled.div`
	grid-row: 1;
	grid-column: 1;
	text-align: center;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
`

const Gallery = (props: { children: GalleryEntry[] | GalleryEntry }) => {
	const { children } = props

	const middleBarRef = useRef<HTMLDivElement | null>(null)
	const [galleryMiddleBarDimensions, setGalleryMiddleBarDimensions] =
		useState<[number, number] | null>(null)
	useEffect(() => {
		const { current } = middleBarRef
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setGalleryMiddleBarDimensions([width, height])
			})
			observer.observe(current)
			return () => {
				observer.unobserve(current)
			}
		}
	}, [middleBarRef, middleBarRef.current])

	const bottomBarRef = useRef<HTMLDivElement | null>(null)
	const [galleryBottomBarDimensions, setGalleryBottomBarDimensions] =
		useState<[number, number] | null>(null)
	useEffect(() => {
		const { current } = bottomBarRef
		if (current) {
			const observer = new ResizeObserver(() => {
				const width = current.clientWidth
				const height = current.clientHeight
				setGalleryBottomBarDimensions([width, height])
			})
			observer.observe(current)
			return () => {
				observer.unobserve(current)
			}
		}
	}, [bottomBarRef, bottomBarRef.current])

	const arrayChildren = useMemo(() => {
		return children instanceof Array ? children : [children]
	}, [children])

	return (
		<GalleryContainer $galleryHeight="80vh">
			<GalleryTopBar>Hell world! I am top bar!</GalleryTopBar>
			<GalleryMiddleBar
				ref={middleBarRef}
				itemHeight={
					galleryMiddleBarDimensions
						? galleryMiddleBarDimensions[1]
						: null
				}
				entries={arrayChildren}
			/>
			<GalleryBottomBar
				ref={bottomBarRef}
				itemHeight={
					galleryBottomBarDimensions
						? galleryBottomBarDimensions[1]
						: null
				}
				entries={arrayChildren}
			/>
		</GalleryContainer>
	)
}

export default Gallery
