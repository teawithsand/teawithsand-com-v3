import React, { CSSProperties, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"

import {
	BREAKPOINT_MD,
	breakpointMediaDown,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { Button } from "tws-common/ui"

const slideDuration = "300ms"
const slideDurationNumber = parseInt(slideDuration.slice(0, -2))

const ShowButtonComponent = styled(Button)`
	z-index: 9;

	justify-content: center;
	align-self: center;

	margin-bottom: auto;
	margin-left: auto;
	margin-top: 1rem;
	margin-right: 1rem;
`

export const SidePanel = () => {
	const [isEnabled, setIsEnabled] = useState(true)

	return (
		<>
			<ShowButtonComponent onClick={() => setIsEnabled(true)}>
				Show panel
			</ShowButtonComponent>
			<CSSTransition
				timeout={slideDurationNumber}
				in={isEnabled}
				appear={true}
				classNames={"slide"}
			>
				<SidePanelComponent setShown={to => setIsEnabled(to)} />
			</CSSTransition>
		</>
	)
}

const InnerContainer = styled.div`
	background: rgb(241, 193, 123);
	background: linear-gradient(
		45deg,
		rgba(241, 193, 123, 1) 0%,
		rgba(196, 100, 230, 1) 50%,
		rgba(113, 231, 255, 1) 100%
	);

	min-height: 100%;
	width: 33%;

	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		width: 100%;
	}
	margin-left: auto;

	overflow-x: hidden;
	overflow-y: scroll;

	z-index: 10;

	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	grid-auto-rows: auto;
	gap: 1rem;

	padding: 1rem;

	&.slide {
		transform: translateX(0);
	}

	&.slide-enter {
		transform: translateX(100%);
	}

	&.slide-enter-active {
		transition: transform ${slideDuration};
		transform: translateX(0);
	}

	&.slide-enter-done {
		transform: translateX(0);
	}

	&.slide-exit {
		transform: translateX(0);
	}

	&.slide-exit-active {
		transform: translateX(100%);
		transition: transform ${slideDuration};
	}

	&.slide-exit-done {
		transform: translateX(100%);
		visibility: hidden;
	}
`

const SidePanelComponent = (props: {
	className?: string
	style?: CSSProperties
	setShown: (shown: boolean) => void
}) => {
	return (
		<InnerContainer className={props.className} style={props.style}>
			<Button onClick={() => props.setShown(false)}>Hide</Button>
		</InnerContainer>
	)
}
