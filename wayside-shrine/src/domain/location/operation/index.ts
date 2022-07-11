import {
	LoadedLocationData,
	useLocationDataLock,
	useLocationDataStore,
} from "@app/domain/location/store"

import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { claimId, NS_REACT_QUERY } from "tws-common/misc/GlobalIDManager"
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "tws-common/react/hook/query"

const LIST_QUERY_ID = claimId(NS_REACT_QUERY, "wayside-shrines/location/list")
const GET_QUERY_ID = claimId(NS_REACT_QUERY, "wayside-shrines/location/get")

export const useLocationList = () => {
	const store = useLocationDataStore()
	const lock = useLocationDataLock()
	return useQuery(
		[LIST_QUERY_ID],
		async () =>
			await lock.withLockRead(async () => {
				const keys = await collectAsyncIterable(store.keys())
				const results: LoadedLocationData[] = []
				for (const id of keys) {
					const data = await store.get(id)
					if (!data) continue

					results.push({
						data,
						id,
					})
				}

				return results
			}),
	)
}

export const useGetLocation = (id: string) => {
	const store = useLocationDataStore()
	const lock = useLocationDataLock()
	return useQuery(
		[GET_QUERY_ID, id],
		async () =>
			await lock.withLockRead(async () => (await store.get(id)) ?? null),
	)
}

export const useUpsertLocation = () => {
	const queryClient = useQueryClient()
	const store = useLocationDataStore()
	const lock = useLocationDataLock()
	return useMutation(
		async (data: LoadedLocationData) =>
			await lock.withLockWrite(async () => {
				const created = !(await store.has(data.id))
				await store.set(data.id, data.data)
				return created
			}),
		{
			onSettled: (_res, _error, data) => {
				queryClient.invalidateQueries([LIST_QUERY_ID])
				queryClient.invalidateQueries([GET_QUERY_ID, data.id])
			},
		},
	)
}

export const useDeleteLocation = () => {
	const queryClient = useQueryClient()
	const store = useLocationDataStore()
	const lock = useLocationDataLock()

	return useMutation(
		async (id: string) =>
			await lock.withLockWrite(async () => {
				const had = await store.has(id)
				await store.delete(id)
				return had
			}),
		{
			onSettled: (_res, _error, id) => {
				queryClient.invalidateQueries([LIST_QUERY_ID])
				queryClient.invalidateQueries([GET_QUERY_ID, id])
			},
		},
	)
}
