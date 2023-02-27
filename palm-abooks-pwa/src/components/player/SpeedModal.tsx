import React from "react"
import { useDispatch } from "react-redux"

import { playerUiSetShownModal } from "@app/domain/redux/playerUi"
import { useBFRSelector, usePlayerUiSelector } from "@app/domain/redux/store"
import { useAppTranslation } from "@app/trans/AppTranslation"

import {
	setPreservePitchForSpeed,
	setSpeed,
} from "tws-common/player/bfr/actions"
import { Button, Form, Modal } from "tws-common/ui"

// TODO(teawithsand): add more options here, like pitch or loudness boosting

const SpeedModal = () => {
	const dispatch = useDispatch()
	const translation = useAppTranslation()

	const currentSpeed = useBFRSelector(bfr => bfr.playerConfig.speed)
	const isPreservePitch = useBFRSelector(
		bfr => bfr.playerConfig.preservePitchForSpeed,
	)
	const show = usePlayerUiSelector(s => s.shownModal === "speed")

	const onHide = () => {
		dispatch(playerUiSetShownModal(null))
	}

	return (
		<Modal
			fullscreen={true}
			show={show}
			centered
			onHide={onHide}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{translation.player.speedModal.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>{translation.player.speedModal.title}</h4>
				<Form.Group>
					<Form.Label>
						{translation.player.speedModal.currentSpeed(
							currentSpeed,
						)}
					</Form.Label>
					<Form.Range
						max={4}
						min={0.25}
						step={0.05}
						value={currentSpeed}
						onChange={e => {
							const v = parseFloat(e.target.value)
							if (isFinite(v) && v !== 0) {
								dispatch(setSpeed(v))
							}
						}}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Check
						max={4}
						min={0.25}
						step={0.05}
						label={translation.player.speedModal.preservePitch}
						checked={isPreservePitch}
						onChange={(e: any) => {
							dispatch(
								setPreservePitchForSpeed(!!e.target.checked),
							)
						}}
					/>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>
					{translation.generic.modalClose}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default SpeedModal
