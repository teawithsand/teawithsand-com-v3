import ABookList from "@app/components/abook/ABookList"
import { LoadedABookData, useABookStore } from "@app/domain/abook/ABookStore"
import React from "react"
import { useQuery } from "tws-common/react/hook/query"

const ABookListPage = () => {
	const store = useABookStore()

	const { isLoading, isError, data } = useQuery("abook-list", async () => {
		const abooks: LoadedABookData[] = []
		for await (const key of store.keys()) {
			const ar = await store.get(key)
			if (!ar) continue
			abooks.push(ar.data)
		}
		return abooks
	})

	if (isLoading) {
		return (
			<div>
				<h3>Loading...</h3>
			</div>
		)
	}

	if (isError) {
		return (
			<div>
				An error occurred while trying to load ABooks! Try to reload
				them later. If this keeps happening, report bug.
			</div>
		)
	}

	return (
		<div>
			<ABookList abooks={data ?? []} />
		</div>
	)
}

export default ABookListPage
