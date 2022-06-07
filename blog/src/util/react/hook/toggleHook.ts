import { useState } from "react"

export const useToggle = (init?: boolean) => {
	const [toggled, setToggle] = useState(!!init)
	return [
		toggled,
		() => {
			setToggle(!toggled)
		},
	]
}
export const useNamedToggle = (init?: boolean) => {
	const [toggled, setToggle] = useState(!!init)
	return {
		toggled: toggled,
		toggle: () => {
			setToggle(!toggled)
		},
	}
}
