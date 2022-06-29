import React from "react"

import ABookList from "@app/components/abook/ABookList"
import PageContainer from "@app/components/layout/PageContainer"
import ErrorExplainer from "@app/components/shared/error-explainer/ErrorExplainer"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { useABookStore } from "@app/domain/abook/ABookStore"
import { LoadedABookData } from "@app/domain/abook/typedef"
import { ABookGTaskRunnerBus } from "@app/domain/gtask"

import { useQuery } from "tws-common/react/hook/query"
import useStickySubscribable from "tws-common/react/hook/useStickySubscribable"

const ABookListPage = () => {
	const store = useABookStore()

	const { status, data, error } = useQuery("abook-list", async () => {
		const abooks: LoadedABookData[] = []
		for await (const key of store.keys()) {
			const ar = await store.get(key)
			if (!ar) continue
			abooks.push(ar.data)
		}
		return abooks
	})

	const currentTask = useStickySubscribable(ABookGTaskRunnerBus)
	if (currentTask !== null) {
		return <LoadingSpinner />
	}

	let inner = null
	if (status === "idle" || status === "loading") {
		inner = <LoadingSpinner />
	} else if (status === "error") {
		inner = <ErrorExplainer error={error} />
	} else {
		inner = <ABookList abooks={data} />
	}

	return <PageContainer>{inner}</PageContainer>
}

export default ABookListPage
