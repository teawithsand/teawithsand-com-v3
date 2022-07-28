import React from "react"
import styled from "styled-components"

import { SidePanel } from "@app/components/paint/side-panel/SidePanel"

const InnerContainer = styled.div`
	display: grid;

	grid-template-columns: 100vw;
	grid-template-rows: 100vh;
	padding: 0;
	margin: 0;

    overflow: hidden;

	& > * {
		grid-row: 1;
		grid-column: 1;
	}
`

export const Paint = () => {
	return (
		<InnerContainer>
			<SidePanel />
		</InnerContainer>
	)
}
