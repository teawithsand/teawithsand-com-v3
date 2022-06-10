import { generateUUID } from "tws-common/lang/uuid"

export interface WALStore<T> {
	setOperationData(key: string, data: T): Promise<void>
	dropOperationData(id: string): Promise<void>

	getUndoneOperation(): Promise<{
		data: T
		id: string
	} | null>
}

export class SimpleWALHelper<T, C = void> {
	constructor(
		private readonly store: WALStore<T>,
		private readonly handler: (ctx: C, data: T) => Promise<void>,
	) {}

	/**
	 * Makes sure that no undone operation was left in WAL store.
	 */
	emptyWalStore = async (ctx: C): Promise<void> => {
		for (;;) {
			const op = await this.store.getUndoneOperation()
			if (op === null) return

			await this.handler(ctx, op.data)
			await this.store.dropOperationData(op.id)
		}
	}

	execute = async (data: T, ctx: C): Promise<void> => {
		const id = generateUUID()

		await this.store.setOperationData(id, data)
		try {
			await this.handler(ctx, data)
		} finally {
            // operation has to be considered done always
			await this.store.dropOperationData(id)
		}
	}
}
