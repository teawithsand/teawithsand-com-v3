import React, { ReactFragment, ReactNode } from "react"

import PageContainer from "@app/components/layout/PageContainer"
import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { useABookStore } from "@app/domain/abook/ABookStore"

import { useQuery } from "tws-common/react/hook/query"
import { useGetParamsObject } from "tws-common/react/hook/useGetParams"
import { Col, Row } from "tws-common/ui"

const ABookView = () => {
	const store = useABookStore()
	const { id } = useGetParamsObject()

	const {
		data: abookAR,
		isLoading,
		isError,
	} = useQuery(["abook-view-get-abook", id], async () => {
		const abookAR = await store.get(id ?? "")
		return abookAR
	})

	let inner: ReactFragment | ReactNode = null
	if (isLoading) {
		inner = (
			<>
				<LoadingSpinner />
			</>
		)
	} else if (isError) {
		inner = (
			<div>
				An error occurred while loading ABook with id `{id ?? ""}`
			</div>
		)
	} else if (abookAR) {
		inner = (
			<>
				<Row>
					<Col>
						<h1>{abookAR.metadata.title}</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						<p>{abookAR.metadata.description}</p>
					</Col>
				</Row>
			</>
		)
	} else {
		inner = (
			<>
				<Row>
					{/* TODO(teawithsand): make this not-found-generic-component */}
					<Col>
						<h1>No such ABook exists. Go back.</h1>
					</Col>
				</Row>
			</>
		)
	}

	return <PageContainer>{inner}</PageContainer>
}

export default ABookView
