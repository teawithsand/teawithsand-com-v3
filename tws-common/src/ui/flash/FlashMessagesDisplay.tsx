import React from "react"
import styled from "styled-components"
import { FlashMessageDisplay } from "tws-common/ui/flash"
import { FlashMessage, FlashMessageId } from "tws-common/ui/flash/flash"

const FlashContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: 0.8em;
	overflow-y: auto;
	max-height: 30vh;
`

const FlashMessagesDisplay = (props: {
	flashes: FlashMessage[]
	onClose: (id: FlashMessageId, i: number) => void
}) => {
	const { flashes, onClose } = props

	return (
		<FlashContainer>
			{flashes.map((f, i) => (
				<FlashMessageDisplay
					flash={f}
					key={f.id}
					onClose={() => {
						onClose(f.id, i)
					}}
				/>
			))}
		</FlashContainer>
	)
}

export default FlashMessagesDisplay
