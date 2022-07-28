import React from "react"

import LocationListPage from "@app/components/page/LocationListPage"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const Page = () => {
	return <LocationListPage />
}

export default wrapNoSSR(Page)
