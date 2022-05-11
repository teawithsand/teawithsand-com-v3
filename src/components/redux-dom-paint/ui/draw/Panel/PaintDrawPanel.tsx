import { Link } from "gatsby"
import React from "react"
import { useDispatch } from "react-redux"

import { homePath } from "@app/components/paths"
import {
	redoUndoneMutation,
	setDrawColor,
	setFillColor,
	setSceneOffsets,
	setSceneSize,
	setZoomFactor,
	undoCommittedMutation,
} from "@app/components/redux-dom-paint/redux/paintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/redux/paintSelectors"
import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"
import { encodeColor, encodeColorForInput, parseColor } from "@app/util/color"
import WithUniqueId from "@app/util/react/components/WithUniqueId"

import * as styles from "./paintDrawPanel.module.scss"

// TODO(teawithsand): move this hack somewhere else
const download = (filename: string, url: string) => {
	const element = document.createElement("a")
	element.setAttribute("href", url)
	element.setAttribute("download", filename)
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

const PaintDrawPanel = (props: {
	showToggleButton?: boolean
	onTogglePanel?: () => void

	svgDataURLHackGetter: () => string
}) => {
	const undoCount = usePaintStateSelector(s => s.committedMutations.length)
	const redoCount = usePaintStateSelector(s => s.redoStack.length)

	const strokeColor = usePaintStateSelector(s => s.uiState.drawColor)
	const fillColor = usePaintStateSelector(s => s.uiState.fillColor)

	const dispatch = useDispatch()

	const zoomFactor = usePaintStateSelector(s => s.sceneParameters.zoomFactor)

	const pathToolOptions = usePaintStateSelector(
		s => s.uiState.pathToolOptions,
	)

	const { sceneWidth, sceneHeight } = usePaintStateSelector(s => ({
		sceneWidth: s.sceneParameters.sceneWidth,
		sceneHeight: s.sceneParameters.sceneHeight,
	}))

	const { showToggleButton, onTogglePanel } = props

	// TODO(teawithsand): allow swipes to hide this panel with useGesture
	return (
		<div className={styles.panel}>
			<div className={styles.section}>
				<h1 className={styles.sectionTopTitle}>TWS Paint App</h1>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>General</h2>
				<Link className={styles.sectionMainButton} to={homePath}>
					Go to home page
				</Link>
				{showToggleButton ? (
					<button
						className={styles.sectionMainButton}
						onClick={() => {
							if (onTogglePanel) onTogglePanel()
						}}
					>
						Toggle panel
					</button>
				) : null}
			</div>

			<div className={styles.section}>
				<ButtonDropdown
					defaultLabel="History"
					className={styles.sectionHeaderButton}
				>
					<div className={styles.section}>
						<div className={styles.sectionButtonBar}>
							<button
								onClick={() => {
									dispatch(undoCommittedMutation())
								}}
							>
								Undo
							</button>
							<button
								onClick={() => {
									dispatch(redoUndoneMutation())
								}}
							>
								Redo
							</button>
						</div>
						<ul className={styles.sectionInfoTextList}>
							<li>You can undo {undoCount} operations</li>
							<li>You can redo {redoCount} operations</li>
						</ul>
					</div>
				</ButtonDropdown>
				{/*
				
					<div className={styles.sectionButtonBar}>
					<button
						onClick={() => {
							dispatch(setZoomFactor(zoomFactor + 0.1))
						}}
					>
						Zoom In
					</button>
					<button
						onClick={() => {
							dispatch(setZoomFactor(zoomFactor - 0.1))
						}}
					>
						Zoom Out
					</button>
					</div>
					*/}
			</div>

			<div className={styles.section}>
				<ButtonDropdown
					defaultLabel="Global settings"
					className={styles.sectionHeaderButton}
				>
					<div className={styles.section}>
						<div className={styles.colorShowcase}>
							<div className={styles.colorShowcaseDescription}>
								Stroke color:
							</div>
							<input
								className={styles.colorShowcasePicker}
								type="color"
								value={encodeColorForInput(strokeColor)}
								onChange={e => {
									dispatch(
										setDrawColor(
											parseColor(e.target.value),
										),
									)
								}}
							/>
							<div
								className={styles.colorShowcaseElement}
								style={{
									["--showcase-color" as any]:
										encodeColor(strokeColor),
								}}
							></div>

							<div className={styles.colorShowcaseDescription}>
								Fill color:
							</div>
							<input
								className={styles.colorShowcasePicker}
								type="color"
								value={encodeColorForInput(
									fillColor ?? [255, 255, 255, 0],
								)}
								onChange={e => {
									dispatch(
										setFillColor(
											parseColor(e.target.value),
										),
									)
								}}
							/>
							<div
								className={styles.colorShowcaseElement}
								style={{
									["--showcase-color" as any]: encodeColor(
										fillColor ?? [0, 0, 0, 0],
									),
								}}
							></div>
						</div>

						<button
							className={styles.sectionMainButton}
							onClick={() => {
								dispatch(setFillColor(null))
							}}
						>
							Remove fill
						</button>
					</div>
				</ButtonDropdown>
			</div>
			<div className={styles.section}>
				<ButtonDropdown
					defaultLabel="Zoom/Screen position"
					className={styles.sectionHeaderButton}
				>
					<div className={styles.sectionInputContainer}>
						<WithUniqueId>
							{id => (
								<>
									<label htmlFor={id}>Scene width:</label>
									<input
										id={id}
										type="number"
										inputMode="numeric"
										step="1"
										pattern="\d*"
										min="0"
										value={sceneWidth.toString()}
										className={styles.sectionInput}
										onChange={e => {
											const v = parseInt(e.target.value)
											if (isFinite(v) && v > 0)
												dispatch(
													setSceneSize({
														width: v,
														height: sceneHeight,
													}),
												)
										}}
									/>
								</>
							)}
						</WithUniqueId>
						<div className={styles.sectionInputContainer}>
							<WithUniqueId>
								{id => (
									<>
										<label htmlFor={id}>
											Scene height:
										</label>
										<input
											id={id}
											type="number"
											inputMode="numeric"
											step="1"
											pattern="\d*"
											min="0"
											value={sceneHeight.toString()}
											className={styles.sectionInput}
											onChange={e => {
												const v = parseInt(
													e.target.value,
												)
												if (isFinite(v) && v > 0)
													dispatch(
														setSceneSize({
															width: sceneWidth,
															height: v,
														}),
													)
											}}
										/>
									</>
								)}
							</WithUniqueId>
						</div>
						<div className={styles.sectionInputContainer}>
							<WithUniqueId>
								{id => (
									<>
										<label htmlFor={id}>
											Zoom: {Math.round(zoomFactor * 100)}
											{"%"}
										</label>
										<input
											className={styles.sectionInput}
											type="range"
											min="0.05"
											max="5"
											step="0.05"
											value={zoomFactor}
											onChange={e => {
												const v = parseFloat(
													e.target.value,
												)
												dispatch(setZoomFactor(v))
											}}
										/>
									</>
								)}
							</WithUniqueId>
						</div>
						<div className={styles.sectionButtonBar}>
							<button
								className={styles.sectionMainButton}
								onClick={() => {
									dispatch(setZoomFactor(1))
								}}
							>
								Reset zoom
							</button>
							<button
								className={styles.sectionMainButton}
								onClick={() => {
									dispatch(setSceneOffsets([0, 0]))
								}}
							>
								Reset scene position
							</button>
						</div>
					</div>
				</ButtonDropdown>
			</div>
			<div className={styles.section}>
				<ButtonDropdown
					defaultLabel="Export"
					className={styles.sectionHeaderButton}
				>
					<div className={styles.section}>
						<div className={styles.sectionInputContainer}>
							<WithUniqueId>
								{id => (
									<>
										<label htmlFor={id}>
											Export file name
										</label>
										<input
											id={id}
											type="text"
											value={"drawing.svg"}
											onChange={v => {}}
										/>
									</>
								)}
							</WithUniqueId>
						</div>
						<button
							className={styles.sectionMainButton}
							onClick={() => {
								download(
									"drawing.svg",
									props.svgDataURLHackGetter(),
								)
							}}
						>
							Download image
						</button>
					</div>
				</ButtonDropdown>
			</div>
		</div>
	)
}

export default PaintDrawPanel
