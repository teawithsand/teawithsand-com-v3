import React from "react"

import LocateMePage from "@app/components/page/LocateMePage"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const LocationLocatePage = () => {
	return (
		<>
			<LocateMePage />
		</>
	)
}

export default wrapNoSSR(LocationLocatePage)
