import React from "react"
import useUniqueId from "tws-common/react/hook/useUniqueId"

const WithUniqueId = (props: {
	children: (id: string) => React.ReactElement
}) => {
	const id = useUniqueId()
	return props.children(id)
}

export default WithUniqueId
