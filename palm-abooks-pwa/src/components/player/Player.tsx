import React from "react"
import { useDispatch } from "react-redux"

import PlayerBar from "@app/components/player/PlayerBar"
import SpeedModal from "@app/components/player/SpeedModal"
import { useBFRSelector } from "@app/domain/redux/store"
import { setWTPPlaylist } from "@app/domain/wtp/actions"
import { WTPPlaylistMetadataType } from "@app/domain/wtp/playlist"
import { WTPSource, WTPSourceType } from "@app/domain/wtp/source"
import { audioMimesAndExtensions } from "@app/util/fileTypes"

import { formatDurationSeconds } from "tws-common/lang/time/format"
import { generateUUID } from "tws-common/lang/uuid"
import {
	doSeek,
	setIsPlayingWhenReady,
	setSpeed,
} from "tws-common/player/bfr/actions"
import { Button, ButtonGroup, Col, Form, Row } from "tws-common/ui"
import PickLocalFilesModal from "@app/components/player/PickLocalFilesModal"

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
										setWTPPlaylist({
											type: WTPPlaylistMetadataType.ANY_SOURCES,
											sources: files.map(
												(f): WTPSource => ({
													type: WTPSourceType.BLOB_SOURCE,
													blob: f,
													preloadedMetadata: null,
													fileName: f.name,
													id: generateUUID(),
												}),
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
			</div>
		</>
	)
}

export default Player
