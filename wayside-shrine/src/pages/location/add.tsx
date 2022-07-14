import React from "react"

import AddLocationPage from "@app/components/page/AddLocationPage"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const Page = () => {
	return <AddLocationPage />
}

export default wrapNoSSR(Page)
