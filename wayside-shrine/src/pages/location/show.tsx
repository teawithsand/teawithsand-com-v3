import React from "react"

import ShowLocationPage from "@app/components/page/ShowLocationPage"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const Page = () => {
	return <ShowLocationPage />
}

export default wrapNoSSR(Page)
