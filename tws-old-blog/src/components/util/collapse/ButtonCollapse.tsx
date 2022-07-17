import React, { useState } from "react"
import { Collapse } from "react-bootstrap"
import { Transition } from "react-transition-group"

const ButtonDropdown = (
	props: {
		className?: string
		children?: React.ReactElement & React.RefAttributes<Transition<any>>
		defaultShown?: boolean
	} & (
		| { shownLabel: string; hiddenLabel: string; defaultLabel?: undefined }
		| {
				defaultLabel: string
				shownLabel?: undefined
				hiddenLabel?: undefined
		  }
	),
) => {
	const {
		children,
		shownLabel,
		hiddenLabel,
		className,
		defaultShown,
		defaultLabel,
	} = props
	const [isShow, setIsShow] = useState(defaultShown ?? false)
	return (
		<>
			<button onClick={() => setIsShow(!isShow)} className={className}>
				{isShow
					? shownLabel ?? defaultLabel
					: hiddenLabel ?? defaultLabel}
			</button>
			<Collapse in={isShow}>{children as any}</Collapse>
		</>
	)
}

export default ButtonDropdown
