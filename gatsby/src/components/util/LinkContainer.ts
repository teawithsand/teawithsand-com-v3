// Adopted from
// https://github.com/react-bootstrap/react-router-bootstrap/blob/master/src/LinkContainer.js
// for

import React, { ReactNode } from "react"
// Adopted from
// https://github.com/react-bootstrap/react-router-bootstrap/blob/master/src/LinkContainer.js

import { navigate } from "gatsby"

const isModifiedEvent = (event: any) =>
	!!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const LinkContainer = (props: {
	children: any
	className?: string
	to: string
	style?: React.CSSProperties
	replace?: boolean
}) => {
	const { to, style, className, children, replace, ...other } = props
	const child = React.Children.only(children)
	const isActive = false

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (children.props.onClick) {
			children.props.onClick(event)
		} else {
			if (
				!event.defaultPrevented &&
				event.button === 0 &&
				!isModifiedEvent(event)
			) {
				event.preventDefault()

				navigate(to, {
					replace,
				})
			}
		}
	}

	return React.cloneElement(child, {
		...other,
		className: [className, child.props.className].join(" ").trim(),
		style,
		href: to,
		onClick: handleClick,
	})
}

export default LinkContainer
