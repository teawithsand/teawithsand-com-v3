import SVGSceneRender from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import PaintDrawNoDoomHooks from "@app/components/redux-dom-paint/ui/draw/PaintDrawNoDOMHooks"
import PaintDrawPanel from "@app/components/redux-dom-paint/ui/draw/PaintDrawPanel"
import usePaintDraw from "@app/components/redux-dom-paint/ui/draw/usePaintDraw"
import { setRenderSize } from "@app/components/redux-dom-paint/redux/paintActions"
import {
	usePaintStateSelector,
	useSceneInfo,
	useSceneSelector,
} from "@app/components/redux-dom-paint/redux/paintSelectors"
import { usePathTool } from "@app/components/redux-dom-paint/ui/tool/path"
import classnames from "@app/util/lang/classnames"
import { useBreakpoint } from "@app/util/react/hook/dimensions/useBreakpoint"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { CSSTransition } from "react-transition-group"

import * as styles from "./paintDrawDisplay.module.scss"

const moveOutClasses = findTransitionClasses("moveOut", styles)

export default () => {
	const dispatch = useDispatch()
	const { renderWidth, renderHeight, viewBox } = useSceneInfo()

	const breakpoint = useBreakpoint()
	const isSuperSmallToShowInnerButton =
		breakpoint === "sm" || breakpoint === "xs"

	const [showSidePanel, setShowSidePanel] = useState(true)
	const [isAnimatingNow, setIsAnimatingNow] = useState(false)

	const elementRef = useRef<HTMLDivElement | null>(null)

	const pathTool = usePathTool()

	const bind = usePaintDraw(elementRef, event => {
		pathTool.onEvent(event)
	})

	const scene = useSceneSelector()

	const { height: windowHeight, width: windowWidth } = getUsefulDimensions()

	// It can't be stored in PaintDrawNoDOMHooks, since it does not work with hot reload
	// for some reason
	// it would reload redux
	// but wont call callback in useEffect again.
	useEffect(() => {
		dispatch(
			setRenderSize({
				width: windowWidth,
				height: windowHeight,
			})
		)
	}, [windowHeight, windowWidth])

	return (
		<div
			className={classnames(styles.drawContainer)}
			style={{
				width: "100vw",
				height: "100vh",
			}}
		>
			{/* TODO(teawithsand): for sake of good code style, move this to the top of return of render function */}
			<PaintDrawNoDoomHooks />
			<div
				className={styles.drawContainerMainDisplay}
				ref={elementRef}
				{...bind}
			>
				<SVGSceneRender
					scene={scene}
					height={renderHeight}
					width={renderWidth}
					viewBox={viewBox}
				/>
			</div>

			{/* TODO(teawithsand): make this pretty appear on small devices, right now it causes style flash */}
			{!isAnimatingNow &&
			(!showSidePanel || !isSuperSmallToShowInnerButton) ? (
				<button
					className={styles.drawContainerTogglePanel}
					onClick={() => setShowSidePanel(!showSidePanel)}
				>
					Toggle panel
				</button>
			) : null}

			<CSSTransition
				timeout={500}
				in={showSidePanel}
				appear={true}
				classNames={moveOutClasses}
				onEnter={() => setIsAnimatingNow(true)}
				onEntered={() => setIsAnimatingNow(false)}
				onExit={() => setIsAnimatingNow(true)}
				onExited={() => setIsAnimatingNow(false)}
			>
				{/*
					This div really simplifies css selectors hierarchy in pantDrawDisplay.module.scss
					so it stays here.

					It wouldn't be that bad do pass className down the hierarchy, but who needs that?
				*/}
				<div className={styles.drawContainerSidePanel}>
					<PaintDrawPanel
						showToggleButton={isSuperSmallToShowInnerButton}
						onTogglePanel={() => setShowSidePanel(!showSidePanel)}
					/>
				</div>
			</CSSTransition>
		</div>
	)
}
