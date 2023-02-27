import React from "react"
import { Alert, Fade } from "react-bootstrap"
import { FlashMessage } from "tws-common/ui/flash/flash"

const FlashMessageDisplay = (props: {
	flash: FlashMessage
	onClose: () => void
}) => {
	const { flash, onClose } = props

	return (
		<Alert
			variant={flash.variant}
			onClose={() => {
				onClose()
			}}
			dismissible
			transition={Fade}
		>
			{flash.message}
		</Alert>
	)
}

export default FlashMessageDisplay
