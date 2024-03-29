import React from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import { LocationForm } from "@app/components/location/form/LocationForm"
import { useUpsertLocation } from "@app/domain/location/operation"
import { locationShowPath } from "@app/paths"

import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { useNavigate } from "tws-common/react/hook/useNavigate"

const AddLocationPage = () => {
	const mutation = useUpsertLocation()
	const navigate = useNavigate()

	return (
		<PageContainer>
			<main>
				<PageBoundary>
					<LocationForm
						onSubmit={async data => {
							const id = generateUUID()
							await mutation.mutateAsync({
								id,
								data: {
									coordinates: {
										latitude: data.latitude,
										longitude: data.longitude,
									},
									description: data.description,
									name: data.name,
									timestamp: getNowTimestamp(),
								},
							})

							navigate(locationShowPath(id))
						}}
					/>
				</PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(AddLocationPage)
