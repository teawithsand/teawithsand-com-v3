import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { State } from "@app/domain/redux/store"

import { Container } from "tws-common/ui"
import {
    FlashMessagesDisplay,
    removeFlashMessage
} from "tws-common/ui/flash"

const InnerFlashMessagesDisplay = () => {
	const flashes = useSelector((s: State) => s.flashes.flashMessages)
	const dispatch = useDispatch()

	return (
		<Container className="mt-3">
			<FlashMessagesDisplay
				flashes={flashes}
				onClose={id => {
					dispatch(removeFlashMessage(id))
				}}
			/>
		</Container>
	)
}

export default InnerFlashMessagesDisplay
