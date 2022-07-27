import React from "react"
import styled from "styled-components"

import { ShrineGridEntry } from "@app/components/shrine/grid/ShrineGridEntry"
import { ShrineHeader } from "@app/domain/shrine"

import {
	BREAKPOINT_MD,
	BREAKPOINT_SM,
	breakpointMediaDown,
} from "tws-common/react/hook/dimensions/useBreakpoint"

const GridParent = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: 1fr;

	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		grid-template-columns: repeat(2, 1fr);
	}

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		grid-template-columns: repeat(1, 1fr);
	}

	justify-items: stretch;
	align-items: center;

	min-width: 0px;
	gap: 2rem;
	box-sizing: border-box;
`

export const ShrinesGrid = (props: { shrines: ShrineHeader[] }) => {
	const posts = props.shrines
	return (
		<GridParent>
			{posts.map((v, i) => (
				<ShrineGridEntry key={i} header={v} />
			))}
		</GridParent>
	)
}
