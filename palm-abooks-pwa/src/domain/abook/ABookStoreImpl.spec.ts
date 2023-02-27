import { ABookStore } from "@app/domain/abook/ABookStore"
import ABookStoreImpl from "@app/domain/abook/ABookStoreImpl"
import { ABookMetadata } from "@app/domain/abook/typedef"

import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import InMemoryKeyValueStore from "tws-common/keyvalue/InMemoryKeyValueStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { WebKeyedLocks } from "tws-common/lang/lock/keyed/WebKeyedLocks"
import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"

describe("ABookStore", () => {
	let store: ABookStore
	const wkl = new WebKeyedLocks()
	beforeEach(() => {
		const id = generateUUID()
		store = new ABookStoreImpl(
			new InMemoryKeyValueStore(),
			new KeyValueObjectFileStore(
				new InMemoryKeyValueStore(),
				new InMemoryKeyValueStore(),
				new KeyValueWALStore(new InMemoryKeyValueStore()),
				wkl.getRWLockAdapter(`${id}_objectStoreLock`),
			),
			wkl.getRWLockAdapter(`${id}_asdf`),
			wkl.getRWLockAdapter(
				`${id}_` + `asdf`.split("").reverse().join(""),
			),
		)
	})

	it("can store abook", async () => {
		const meta: ABookMetadata = {
			addedAt: getNowTimestamp(),
			description: "Some desc",
			title: "Some title",
		}
		const id = await store.create(meta)

		const ar = await store.get(id)
		expect(ar).not.toBeNull()
		if (ar === null) return // makes ts happy

		expect(ar.metadata).toEqual(meta)
		expect(await collectAsyncIterable(ar.files.keys())).toEqual([])
	})

	it("can delete abook via active record", async () => {
		const meta: ABookMetadata = {
			addedAt: getNowTimestamp(),
			description: "Some desc",
			title: "Some title",
		}
		const id = await store.create(meta)

		const ar = await store.get(id)
		expect(ar).not.toBeNull()
		if (ar === null) return // makes ts happy

		await ar.delete()

		const newAr = await store.get(id)
		expect(newAr).toBeNull()
	})

	it("can delete abook via store", async () => {
		const meta: ABookMetadata = {
			addedAt: getNowTimestamp(),
			description: "Some desc",
			title: "Some title",
		}
		const id = await store.create(meta)

		await store.delete(id)

		const newAr = await store.get(id)
		expect(newAr).toBeNull()
	})

	it("can delete abook when compound lock is claimed", async () => {
		await store.compoundOperationsLock.withLockWrite(async () => {
			const meta: ABookMetadata = {
				addedAt: getNowTimestamp(),
				description: "Some desc",
				title: "Some title",
			}
			const id = await store.create(meta)

			await store.delete(id)

			const newAr = await store.get(id)
			expect(newAr).toBeNull()
		})
	})
})
