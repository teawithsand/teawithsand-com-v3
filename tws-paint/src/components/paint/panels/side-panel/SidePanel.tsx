import React, { CSSProperties, ReactNode, useMemo, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"

import { CanvasDimensionsPanel } from "@app/components/paint/panels/impls/CanvasDimensionsPanel"
import { PickToolPanel } from "@app/components/paint/panels/impls/PickToolPanel"
import { ZoomPanel } from "@app/components/paint/panels/impls/ZoomPanel"
import { PanelSwitcher } from "@app/components/paint/panels/side-panel/PanelSwitcher"
import {
	sidePanelButtonZIndex,
	sidePanelZIndex,
} from "@app/components/paint/pantZAxis"
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
	z-index: ${sidePanelButtonZIndex};

	justify-content: center;
	align-self: center;

	margin-bottom: auto;
	margin-left: auto;
	margin-top: 1rem;
	margin-right: 1rem;
`

/**
 * Note: side panel is not just another panel.
 * It's THE Side Panel.
 *
 * All the panels API do not apply to this one.
 */
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
	background: linear-gradient(45deg, #f1c17b 0%, #cf9ce2 50%, #71e7ff 100%);

	min-height: 100%;
	width: 33%;

	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		width: 100%;
	}
	margin-left: auto;

	overflow-x: hidden;
	overflow-y: scroll;

	z-index: ${sidePanelZIndex};

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
		font-size: 1.7rem;
	}
`

const SidePanelToggleButton = styled(Button)`
	width: 100%;
	font-size: 1.5rem;
`

const SubPanelContainer = styled.div`
	background-color: rgba(255, 255, 255, 0.9);
	padding: 1rem;
	border-radius: 0.25rem;
	box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
		rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
		rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`

const wrapSubPanel = (panel: ReactNode) => {
	return <SubPanelContainer>{panel}</SubPanelContainer>
}

const ToolButtonGroup = styled.div`
	display: flex;
	gap: 1rem;
	flex-flow: row wrap;
`
const ToolButton = styled(Button).attrs(props => ({
	...props,
	variant: "secondary",
}))`
	font-size: 1.1rem;
`

const FallbackContainer = styled.div`
	text-align: center;
`

const FallbackPanel = () => {
	return (
		<SubPanelContainer>
			<FallbackContainer>
				Here will be displayed any panel you choose. You can chose one
				using buttons above.
			</FallbackContainer>
		</SubPanelContainer>
	)
}

const SidePanelComponent = (props: {
	className?: string
	style?: CSSProperties
	setShown: (shown: boolean) => void
}) => {
	const trans = useAppTranslationSelector(s => s.paint.panel)
	const meta = useAppTranslationSelector(s => s.meta)

	const [activePanelId, setActivePanelId] = useState<string | null>(null)

	const panels = useMemo(() => {
		return [
			{
				id: "zoom",
				panel: <ZoomPanel />,
			},
			{
				id: "canvas-dimensions",
				panel: <CanvasDimensionsPanel />,
			},
			{
				id: "pick-tool",
				panel: <PickToolPanel />,
			},
		].map(v => ({
			...v,
			panel: wrapSubPanel(v.panel),
		}))
	}, [])

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
				<ToolButtonGroup>
					<ToolButton onClick={() => setActivePanelId("zoom")}>
						Zoom
					</ToolButton>
					<ToolButton
						onClick={() => setActivePanelId("canvas-dimensions")}
					>
						Scene size
					</ToolButton>
					<ToolButton onClick={() => setActivePanelId("pick-tool")}>
						Pick tool
					</ToolButton>
				</ToolButtonGroup>
				<PanelSwitcher
					fallbackPanel={<FallbackPanel />}
					activePanelId={activePanelId}
					panels={panels}
				/>
			</InnerContainer>
		</OuterContainer>
	)
}

/*
<ButtonDropdown
	defaultShown={false}
	shownLabel="Hide zoom options"
	hiddenLabel="Show zoom options"
>
	<SubPanelContainer>
		<ZoomPanel />
	</SubPanelContainer>
</ButtonDropdown>

<ButtonDropdown
	defaultShown={false}
	shownLabel="Hide canvas size options"
	hiddenLabel="Show canvas size options"
>
	<SubPanelContainer>
		<CanvasDimensionsPanel />
	</SubPanelContainer>
</ButtonDropdown>

<ButtonDropdown
	defaultShown={false}
	shownLabel="Hide tool picker"
	hiddenLabel="Show tool picker"
>
	<SubPanelContainer>
		<PickToolPanel />
	</SubPanelContainer>
</ButtonDropdown>
*/
