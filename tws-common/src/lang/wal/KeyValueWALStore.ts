import KeyValueStore from "tws-common/keyvalue/KeyValueStore"
import { WALStore } from "tws-common/lang/wal"

export default class KeyValueWALStore<T extends {}> implements WALStore<T> {
	constructor(private readonly keyValueStore: KeyValueStore<T>) {}

	setOperationData = async (key: string, data: T): Promise<void> => {
		await this.keyValueStore.set(key, data)
	}

	dropOperationData = async (id: string): Promise<void> => {
		await this.keyValueStore.delete(id)
	}

	getUndoneOperation = async (): Promise<{ data: T; id: string } | null> => {
		for await (const id of this.keyValueStore.iterateKeys()) {
			const data = await this.keyValueStore.get(id)
			if (!data) continue

			return {
				id,
				data,
			}
		}

		return null
	}
}
