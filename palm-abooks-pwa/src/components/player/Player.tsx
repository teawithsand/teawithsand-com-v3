import { setWhatToPlaySource } from "@app/domain/redux/actions"
import { useBFRSelector } from "@app/domain/redux/store"
import { audioMimesAndExtensions } from "@app/util/fileTypes"
import React from "react"
import { useDispatch } from "react-redux"
import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
import { BlobPlayerSource } from "tws-common/player/source/PlayerSource"
import { Button, ButtonGroup, Col, Form, Row } from "tws-common/ui"

const Player = () => {
	const currentSourceIndex = useBFRSelector(
		bfr => bfr.playerConfig.currentSourceIndex,
	)
	const isReallyPlaying = useBFRSelector(
		bfr => bfr.playerState?.playbackState?.isPlaying ?? false,
	)
	const isPlayingWhenReady = useBFRSelector(
		bfr => bfr.playerConfig.isPlayingWhenReady,
	)
	const sources = useBFRSelector(bfr => bfr.playerConfig.playlist.data)
	const currentDuration = useBFRSelector(
		bfr => bfr.playerState.playbackState.duration,
	)
	const currentPosition = useBFRSelector(
		bfr => bfr.playerState.playbackState.position,
	)

	const dispatch = useDispatch()

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
						Position: {currentPosition ?? 0} out of{" "}
						{currentDuration ?? 0}
					</p>
					<ol>
						{sources.map((s, i) => (
							<li key={i}>Source no. {i + 1}</li>
						))}
					</ol>
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
