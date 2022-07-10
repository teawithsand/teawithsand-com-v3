import React from "react"

import PageContainer from "@app/components/layout/PageContainer"
import LocationList from "@app/components/location/LocationList"
import {
	LoadedLocationData,
	useLocationDataLock,
	useLocationDataStore,
} from "@app/domain/location/store"

import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { claimId, NS_REACT_QUERY } from "tws-common/misc/GlobalIDManager"
import { useQuery } from "tws-common/react/hook/query"

const QUERY_ID = claimId(NS_REACT_QUERY, "wayside-shines/list-locations")

const LocationListPage = () => {
	const store = useLocationDataStore()
	const lock = useLocationDataLock()

	const { status, data, error } = useQuery(
		QUERY_ID,
		async () =>
			await lock.withLockRead(async () => {
				const keys = await collectAsyncIterable(store.keys())

				const locations: LoadedLocationData[] = []
				for (const k of keys) {
					const ld = await store.get(k)
					if (!ld) continue

					locations.push({
						id: k,
						data: ld,
					})
				}

				return locations
			}),
	)

	return (
		<PageContainer>
			<main>
				<LocationList locations={[]} />
			</main>
		</PageContainer>
	)
}

export default LocationListPage
