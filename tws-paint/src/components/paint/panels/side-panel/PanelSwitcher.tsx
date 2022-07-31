import React, { ReactNode, useMemo } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import styled from "styled-components"

const transitionTime = 200
const transitionTimeCss = `${transitionTime}ms`

const SwitcherContainer = styled.div`
	display: grid;
	& > * {
		grid-row: 1;
		grid-column: 1;
	}

	& .dissolve-enter {
		opacity: 0;
	}
	& .dissolve-enter-active {
		opacity: 1;
		transition: opacity ${transitionTimeCss} ease-in;
	}
	& .dissolve-exit {
		opacity: 1;
	}
	& .dissolve-exit-active {
		opacity: 0;
		transition: opacity ${transitionTimeCss} ease-in;
	}
`

export const PanelSwitcher = (props: {
	panels: {
		id: string
		panel: ReactNode
	}[]
	fallbackPanel: ReactNode
	activePanelId: string | null
}) => {
	const { panels, activePanelId, fallbackPanel } = props

	const activePanel = useMemo(() => {
		const res = panels.find(({ id }) => id === activePanelId)
		if (res) {
			return res.panel
		}
		return null
	}, [activePanelId])

	return (
		<SwitcherContainer>
			<SwitchTransition mode={"out-in"}>
				<CSSTransition
					key={activePanelId}
					timeout={transitionTime}
					classNames="dissolve"
				>
					{activePanel ?? fallbackPanel}
				</CSSTransition>
			</SwitchTransition>
		</SwitcherContainer>
	)
}
