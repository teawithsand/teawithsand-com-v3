import React from "react"

import EditLocationPage from "@app/components/page/EditLocationPage"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const Page = () => {
	return <EditLocationPage />
}

export default wrapNoSSR(Page)
