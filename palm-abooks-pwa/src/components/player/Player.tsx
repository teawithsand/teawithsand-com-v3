import React from "react"
import { useDispatch } from "react-redux"

import { setWhatToPlaySource } from "@app/domain/redux/actions"
import { useBFRSelector } from "@app/domain/redux/store"
import { audioMimesAndExtensions } from "@app/util/fileTypes"

import { formatDurationSeconds } from "tws-common/lang/time/format"
import {
	doSeek,
	setIsPlayingWhenReady,
	setSpeed,
} from "tws-common/player/bfr/actions"
import { BlobPlayerSource } from "tws-common/player/source/PlayerSource"
import { Button, ButtonGroup, Col, Form, Row } from "tws-common/ui"

const ZERO_ONE_RANGE_FIELD_MULTIPLIER = 100000

const Player = () => {
	const dispatch = useDispatch()

	const currentSourceIndex = useBFRSelector(
		bfr => bfr.playerConfig.currentSourceIndex,
	)
	const isReallyPlaying = useBFRSelector(
		bfr => bfr.playerState?.playbackState?.isPlaying ?? false,
	)
	const isPlayingWhenReady = useBFRSelector(
		bfr => bfr.playerConfig.isPlayingWhenReady,
	)
	const currentDuration = useBFRSelector(
		bfr => bfr.playerState.playbackState.duration,
	)
	const currentPosition = useBFRSelector(
		bfr => bfr.playerState.playbackState.position,
	)

	const currentSpeed = useBFRSelector(bfr => bfr.playerConfig.speed)
	return (
		<div>
			<Row>
				<Form
					onSubmit={(e: any) => {
						e.preventDefault()
						return false
					}}
				>
					<Form.Group>
						<Form.Label>Files to play</Form.Label>
						<Form.Control
							accept={audioMimesAndExtensions.join(",")}
							type="file"
							value={undefined}
							multiple
							onChange={(e: any) => {
								// TODO(teawithsand): check if it works on older browsers, works on state-of-art ff
								const files: File[] = [
									...(e.target.files || []),
								]
								files.sort((a, b) =>
									a.name.localeCompare(b.name),
								)

								dispatch(
									setWhatToPlaySource({
										type: "raw-no-meta",
										sources: files.map(
											f => new BlobPlayerSource(f),
										),
									}),
								)
							}}
						/>
					</Form.Group>
				</Form>
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
						Position: {formatDurationSeconds(currentPosition ?? 0)}{" "}
						out of {formatDurationSeconds(currentDuration ?? 0)}{" "}
						{Math.round(
							((currentPosition ?? 0) / (currentDuration ?? 1)) *
								100 * 10,
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
							currentDuration === null || currentPosition === null
						}
						value={
							((currentPosition ?? 1) / (currentDuration ?? 1)) *
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
									setIsPlayingWhenReady(!isPlayingWhenReady),
								)
							}}
						>
							Toggle play/pause
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
		</div>
	)
}

export default Player
