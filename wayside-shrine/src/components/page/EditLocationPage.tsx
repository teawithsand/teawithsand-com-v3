import { Link } from "gatsby"
import React from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import { LocationForm } from "@app/components/location/form/LocationForm"
import {
	useGetLocation,
	useUpsertLocation,
} from "@app/domain/location/operation"
import { LocationData } from "@app/domain/location/store"
import { locationShowPath } from "@app/paths"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { useGetParamsObject } from "tws-common/react/hook/useGetParams"
import { useNavigate } from "tws-common/react/hook/useNavigate"

const InnerPage = () => {
	const mutation = useUpsertLocation()
	const navigate = useNavigate()

	const { id } = useGetParamsObject()
	const { data } = useGetLocation(id ?? "")
	if (!data) {
		throw new Error(
			"Location not found TODO(teawithsand): make this error typed",
		)
	}

	return (
		<>
			<Link to={locationShowPath(id)}>
				<h1>{data.name}</h1>
			</Link>
			<LocationForm
				initialValues={{
					description: data.description,
					latitude: data.coordinates.latitude,
					longitude: data.coordinates.longitude,
					name: data.name,
				}}
				onSubmit={async formData => {
					// TODO(teawithsand): implement this function

					const newData: LocationData = {
						...data,
						name: formData.name,
						description: formData.description,
						coordinates: {
							latitude: formData.latitude,
							longitude: formData.longitude,
						},
					}

					await mutation.mutateAsync({
						id,
						data: newData,
					})

					navigate(locationShowPath(id))
				}}
			/>
		</>
	)
}

const EditLocationPage = () => {
	return (
		<PageContainer>
			<main>
				<PageBoundary>
					<InnerPage />
				</PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(EditLocationPage)
