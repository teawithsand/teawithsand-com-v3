import React, { useState } from "react"
import { Collapse } from "react-bootstrap"
import { Transition } from "react-transition-group"

const ButtonDropdown = (props: {
	shownLabel?: string
	hiddenLabel?: string
	className?: string
	children?: React.ReactElement & React.RefAttributes<Transition<any>>
}) => {
	const { children, shownLabel, hiddenLabel, className } = props
	const [isShow, setIsShow] = useState(false)
	return (
		<>
			<button onClick={() => setIsShow(!isShow)} className={className}>
				{isShow ? shownLabel : hiddenLabel}
			</button>
			<Collapse in={isShow}>{children as any}</Collapse>
		</>
	)
}

export default ButtonDropdown
