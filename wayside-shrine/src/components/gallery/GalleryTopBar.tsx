import React from "react"
import styled from "styled-components"

const InnerGalleryTopBar = styled.div`
	grid-row: 1;
	grid-column: 1;
	text-align: center;

	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
`

export default () => {
	return <InnerGalleryTopBar>Top Bar</InnerGalleryTopBar>
}
