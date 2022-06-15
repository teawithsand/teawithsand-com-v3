import { setWhatToPlaySource } from "@app/domain/redux/actions"
import { useBFRSelector } from "@app/domain/redux/store"
import { audioMimesAndExtensions } from "@app/util/fileTypes"
import React from "react"
import { useDispatch } from "react-redux"
import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
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
	const sources = useBFRSelector(bfr => bfr.playerConfig.playlist)

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
								const files = [...(e.target.files || [])]
								files.sort((a, b) =>
									a.name.localeCompare(b.name),
								)

								dispatch(
									setWhatToPlaySource({
										type: "raw",
										sources: files,
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
					<ol>
						{sources.map((s, i) => (
							<li key={i}>Source no. #{i + 1}</li>
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
