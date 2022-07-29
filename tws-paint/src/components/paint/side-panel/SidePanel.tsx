import React, { CSSProperties, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"

import { SidePanelZoomSection } from "@app/components/paint/side-panel/SidePanelZoomSection"
import { footerLink } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

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

	const trans = useAppTranslationSelector(s => s.paint.panel)

	return (
		<>
			<ShowButtonComponent onClick={() => setIsEnabled(true)}>
				{trans.show}
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

const OuterContainer = styled.nav`
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

// This inner container is hack to make grid not occupy whole space
// But just have items shrink to top space
// without making background disappear.
//
// Or one could use height: fit-content on each children or manipulate grid-auto-row param
// but I am too lazy for that.
const InnerContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	grid-auto-rows: auto;
	gap: 1rem;
`

const SidePanelHeader = styled.div`
	text-align: center;

	& > p {
		font-size: 1.5rem;
	}
`

const SidePanelToggleButton = styled(Button)`
	width: 100%;
	font-size: 1.2rem;
`

const SidePanelComponent = (props: {
	className?: string
	style?: CSSProperties
	setShown: (shown: boolean) => void
}) => {
	const trans = useAppTranslationSelector(s => s.paint.panel)
	const meta = useAppTranslationSelector(s => s.meta)

	return (
		<OuterContainer className={props.className} style={props.style}>
			<InnerContainer>
				<SidePanelHeader>
					<h1>{meta.title}</h1>
					<p>
						Obviously made by <a href={footerLink}>teawithsand</a>
					</p>
				</SidePanelHeader>
				<SidePanelToggleButton onClick={() => props.setShown(false)}>
					{trans.hide}
				</SidePanelToggleButton>
				<SidePanelZoomSection />
			</InnerContainer>
		</OuterContainer>
	)
}
