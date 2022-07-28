import React, { FC } from "react"
import styled from "styled-components"

import { SidePanel } from "@app/components/paint/side-panel/SidePanel"
import { PaintScene } from "@app/domain/paint/defines"

export type SceneRenderer = FC<PaintScene>

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

	background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
		linear-gradient(-45deg, #808080 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #808080 75%),
		linear-gradient(-45deg, transparent 75%, #808080 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;

	background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
		20px 20px;
`

export const Paint = () => {
	return (
		<InnerContainer>
			<SidePanel />
		</InnerContainer>
	)
}
