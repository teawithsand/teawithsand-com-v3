import { PrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import SVGSceneRender from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import PaintDrawPanel from "@app/components/redux-dom-paint/ui/draw/PaintDrawPanel"
import usePaintDraw from "@app/components/redux-dom-paint/ui/draw/usePaintDraw"
import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import classnames from "@app/util/lang/classnames"
import { useBreakpoint } from "@app/util/react/hook/dimensions/useBreakpoint"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"
import React, { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { CSSTransition } from "react-transition-group"

import * as styles from "./paintDrawDisplay.module.scss"

const moveOutClasses = findTransitionClasses("moveOut", styles)

export default () => {
	const { height, width } = getUsefulDimensions()

	const scene = useSelector<PaintState, PrimPaintScene>(s => s.scene)
	const [sceneWidth, sceneHeight] = useSelector<PaintState, [number, number]>(
		s => [s.sceneWidth, s.sceneHeight]
	)

	const breakpoint = useBreakpoint()
	const isSuperSmallToShowInnerButton =
		breakpoint === "sm" || breakpoint === "xs"

	const [showSidePanel, setShowSidePanel] = useState(true)
	const [isAnimatingNow, setIsAnimatingNow] = useState(false)

	const elementRef = useRef<HTMLDivElement | null>(null)
	const bind = usePaintDraw(elementRef, event => {
		console.log({ event })
	})

	return (
		<div
			className={classnames(styles.drawContainer)}
			style={{
				width: width,
				height: height,
			}}
		>
			<div
				className={styles.drawContainerMainDisplay}
				ref={elementRef}
				{...bind}
			>
				<SVGSceneRender scene={scene} height={sceneHeight} width={sceneWidth} />
			</div>

			{/* TODO(teawithsand): make this pretty appear on small devices, right now it causes style flash */}
			{!isAnimatingNow && (!showSidePanel || !isSuperSmallToShowInnerButton) ? (
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
