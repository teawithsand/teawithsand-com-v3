import SVGSceneRender from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import PaintDrawPanel from "@app/components/redux-dom-paint/ui/draw/PaintDrawPanel"
import usePaintDraw from "@app/components/redux-dom-paint/ui/draw/usePaintDraw"
import {
	setRenderSize,
	setSceneOffsets,
} from "@app/components/redux-dom-paint/redux/paintActions"
import {
	useCursorCorrectPos,
	useSceneInfo,
	useSceneSelector,
} from "@app/components/redux-dom-paint/redux/paintSelectors"
import { usePathTool } from "@app/components/redux-dom-paint/ui/tool/path"
import classnames from "@app/util/lang/classnames"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { CSSTransition } from "react-transition-group"

import * as styles from "./paintDrawDisplay.module.scss"

const panelAnimationClasses = findTransitionClasses("panelAnimation", styles)

const PaintDrawDisplay = () => {
	const dispatch = useDispatch()
	const {
		viewportWidth: renderWidth,
		viewportHeight: renderHeight,
		viewBox,
		transformX,
		transformY,
	} = useSceneInfo()

	const [hideSidePanel, setHideSidePanel] = useState(true)
	const elementRef = useRef<HTMLDivElement | null>(null)

	const pathTool = usePathTool()
	const correctPos = useCursorCorrectPos()

	const bind = usePaintDraw(elementRef, event => {
		// console.log("mouse event", event)
		if (event.type === "mouse") {
			const np = correctPos(event.canvasPoint)
			if (!np) return
			event = {
				...event,
				canvasPoint: np,
			}
		}
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

	const sceneRef = useRef<any>(null)

	const svgDataURLGetter = () =>
		sceneRef.current
			? "data:image/svg+xml;base64," +
			  window.btoa(
					new XMLSerializer().serializeToString(sceneRef.current)
			  )
			: ""

	return (
		<div className={classnames(styles.drawContainer)}>
			<div className={styles.mainDisplay} ref={elementRef} {...bind}>
				<SVGSceneRender
					scene={scene}
					height={renderHeight}
					width={renderWidth}
					viewBox={viewBox}
					svgElementRef={sceneRef}
					style={{
						transform: `translateX(${transformX}px) translateY(${transformY}px)`,
					}}
				/>
			</div>

			{/* TODO(teawithsand): make this pretty appear on small devices, right now it causes style flash */}

			<button
				className={styles.toggleButton}
				onClick={() => setHideSidePanel(!hideSidePanel)}
			>
				Options / Exit
			</button>

			<CSSTransition
				timeout={500}
				in={hideSidePanel}
				appear={true}
				classNames={panelAnimationClasses}
			>
				{/*
					This div really simplifies css selectors hierarchy in pantDrawDisplay.module.scss
					so it stays here.

					It wouldn't be that bad do pass className down the hierarchy, but who needs that?
				*/}

				<div
					className={classnames(
						styles.sidePanel,
						styles.panelAnimation
					)}
				>
					<PaintDrawPanel
						showToggleButton={true}
						onTogglePanel={() => setHideSidePanel(!hideSidePanel)}
						svgDataURLHackGetter={svgDataURLGetter}
					/>
				</div>
			</CSSTransition>
		</div>
	)
}

export default PaintDrawDisplay
