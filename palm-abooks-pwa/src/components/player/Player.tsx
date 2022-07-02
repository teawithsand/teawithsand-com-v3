import React from "react"
import { useDispatch } from "react-redux"

import PickLocalFilesModal from "@app/components/player/PickLocalFilesModal"
import PlayerBar from "@app/components/player/PlayerBar"
import PlayerEntryList from "@app/components/player/PlayerEntryList"
import SpeedModal from "@app/components/player/SpeedModal"
import { useBFRSelector } from "@app/domain/redux/store"

import { formatDurationSeconds } from "tws-common/lang/time/format"
import {
	doSeek,
	setIsPlayingWhenReady,
	setSpeed,
} from "tws-common/player/bfr/actions"
import { Button, ButtonGroup, Col, Form, Row } from "tws-common/ui"

const ZERO_ONE_RANGE_FIELD_MULTIPLIER = 100000

const Player = () => {
	const dispatch = useDispatch()

	const currentSourceIndex = useBFRSelector(
		bfr => bfr.playerConfig.currentSourceIndex,
	)
	const isReallyPlaying = useBFRSelector(bfr => bfr.playerState.isPlaying)
	const isPlayingWhenReady = useBFRSelector(
		bfr => bfr.playerConfig.isPlayingWhenReady,
	)
	const currentDuration = useBFRSelector(bfr => bfr.playerState.duration)
	const currentPosition = useBFRSelector(bfr => bfr.playerState.position)

	const currentSpeed = useBFRSelector(bfr => bfr.playerConfig.speed)

	return (
		<>
			<SpeedModal />
			<PickLocalFilesModal />

			<div>
				<Row className="mb-3">
					<Col>
						<PlayerBar />
					</Col>
				</Row>
				<Row>
					<Col>
						<p>Playing file no: {currentSourceIndex + 1}</p>
						<p>Is playing: {isReallyPlaying ? "Yes" : "No"}</p>
						<p>
							Is playing when possible:{" "}
							{isPlayingWhenReady ? "Yes" : "No"}
						</p>
						<p>
							Position:{" "}
							{formatDurationSeconds(currentPosition ?? 0)} out of{" "}
							{formatDurationSeconds(currentDuration ?? 0)}{" "}
							{Math.round(
								((currentPosition ?? 0) /
									(currentDuration ?? 1)) *
									100 *
									10,
							) / 10}
							%
						</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Range
							max={ZERO_ONE_RANGE_FIELD_MULTIPLIER}
							min={0}
							step={1}
							disabled={
								currentDuration === null ||
								currentPosition === null
							}
							value={
								((currentPosition ?? 1) /
									(currentDuration ?? 1)) *
								ZERO_ONE_RANGE_FIELD_MULTIPLIER
							}
							onChange={e => {
								const v =
									(Math.round(parseFloat(e.target.value)) /
										ZERO_ONE_RANGE_FIELD_MULTIPLIER) *
									(currentDuration ?? 1)

								dispatch(doSeek(v))
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Speed: {currentSpeed}x</Form.Label>
							<Form.Range
								max={4}
								min={0.25}
								step={0.05}
								value={currentSpeed}
								onChange={e => {
									const v = parseFloat(e.target.value)
									if (isFinite(v)) {
										dispatch(setSpeed(v))
									}
								}}
							/>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<ButtonGroup>
							<Button
								onClick={() => {
									dispatch(
										setIsPlayingWhenReady(
											!isPlayingWhenReady,
										),
									)
								}}
							>
								Toggle play/pause
							</Button>
						</ButtonGroup>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<h3>Source list</h3>
					</Col>
				</Row>
				<Row>
					<Col>
						<PlayerEntryList />
					</Col>
				</Row>
			</div>
		</>
	)
}

export default Player
