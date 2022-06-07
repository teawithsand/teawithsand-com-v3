import React from "react"
import { useDispatch } from "react-redux"

import {
	setSceneOffsets,
	setSceneSize,
	setZoomFactor,
} from "@app/components/redux-dom-paint/redux/paintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/redux/paintSelectors"
import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"

import WithUniqueId from "tws-common/react/components/WithUniqueId"

import * as styles from "./paintDrawPanel.module.scss"

const SceneSection = () => {
	const dispatch = useDispatch()
	const zoomFactor = usePaintStateSelector(s => s.sceneParameters.zoomFactor)

	const { sceneWidth, sceneHeight } = usePaintStateSelector(s => ({
		sceneWidth: s.sceneParameters.sceneWidth,
		sceneHeight: s.sceneParameters.sceneHeight,
	}))

	return (
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
									<label htmlFor={id}>Scene height:</label>
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
											const v = parseInt(e.target.value)
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
											const v = parseFloat(e.target.value)
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
	)
}

export default SceneSection
