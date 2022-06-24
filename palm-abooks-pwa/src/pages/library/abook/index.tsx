import { navigate } from "gatsby"
import React from "react"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"
import StorageEstimate from "@app/components/shared/storage-estimate/StorageEstimate"
import { libraryAddABookPath, libraryListABookPath } from "@app/paths"

import { Button, Col, Row } from "tws-common/ui"

// TODO(teawithsand): use bootstrap spacers here when defining row gap
const ButtonList = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-rows: 1fr;
	gap: 1em;
`

const ABookLibraryPage = () => {
	return (
		<PageContainer>
			<Row>
				<Col>
					<h1 className="text-center mb-4">ABook library management</h1>
				</Col>
			</Row>
			<ButtonList className="mb-3">
				<Button
					className="w-100"
					size="lg"
					onClick={() => {
						navigate(libraryListABookPath)
					}}
				>
					ABook list
				</Button>
				<Button
					className="w-100"
					size="lg"
					onClick={() => {
						navigate(libraryAddABookPath)
					}}
				>
					Add ABook from local storage
				</Button>
				<Button className="w-100" size="lg">
					Add ABook from other device via WEBRTC (NIY)
				</Button>
			</ButtonList>
			<StorageEstimate />
			<p>
				In order to play ABooks, you have to add them. Preferably, just
				put them into PalmABooks PWA{"'"}s storage from your local file
				system.
			</p>
			<p>You can also send files or ABooks from different devices(NIY)</p>
		</PageContainer>
	)
}

export default ABookLibraryPage
