import React from "react"

import ABookView from "@app/components/abook/ABookView"
import PageContainer from "@app/components/layout/PageContainer"
import ErrorExplainer from "@app/components/shared/error-explainer/ErrorExplainer"
import NotFoundErrorExplainer from "@app/components/shared/error-explainer/NotFoundErrorExplainer"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { useABookStore } from "@app/domain/abook/ABookStore"
import { libraryListABookPath } from "@app/paths"

import { useQuery } from "tws-common/react/hook/query"
import { useGetParamsObject } from "tws-common/react/hook/useGetParams"

const ABookViewPage = () => {
	const store = useABookStore()
	const { id } = useGetParamsObject()

	const { data, status, error } = useQuery(
		["abook-view-get-abook", id],
		async () => {
			const abookAR = await store.get(id ?? "")
			return abookAR
		},
	)

	let inner = null
	if (status === "idle" || status === "loading") {
		inner = <LoadingSpinner />
	} else if (status === "error") {
		inner = <ErrorExplainer error={error} />
	} else {
		if (data === null) {
			inner = (
				<NotFoundErrorExplainer
					title="Given ABook was not found"
					buttonTargetPath={libraryListABookPath}
					buttonText="Go to list"
				/>
			)
		} else {
			inner = <ABookView abook={data} />
		}
	}

	return <PageContainer>{inner}</PageContainer>
}

export default ABookViewPage
