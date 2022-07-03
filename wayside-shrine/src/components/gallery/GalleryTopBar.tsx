import React from "react"
import styled from "styled-components"

const InnerGalleryTopBar = styled.div`
	grid-row: 1;
	grid-column: 1;
	text-align: center;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
`

const GalleryTopBar = () => {
	return <InnerGalleryTopBar>Top Bar</InnerGalleryTopBar>
}

export default GalleryTopBar
