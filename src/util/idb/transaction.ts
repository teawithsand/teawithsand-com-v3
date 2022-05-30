type Base = {
	done: Promise<unknown>
	commit: () => void
	abort: () => void
}

export const useIDBPTransaction = async <T extends Base, E>(
	tx: T,
	cb: (tx: T) => Promise<E>,
): Promise<E> => {
	let res: E
	try {
		res = await cb(tx)
	} catch (e) {
		try {
			tx.abort()
		} catch (e) {
			// ignore it
		}
		throw e
	}
	tx.commit()

	await tx.done
	return res
}

export const useIDBPTransactionAbortOnly = async <T extends Base, E>(
	tx: T,
	cb: (tx: T) => Promise<E>,
): Promise<E> => {
	let res: E
	try {
		res = await cb(tx)
	} catch (e) {
		try {
			tx.abort()
		} catch (e) {
			// ignore it
		}
		throw e
	}
	try {
		tx.abort()
	} catch (e) {
		// ignore
	}

	try {
		await tx.done
	} catch (e) {
        // ignore, it may have yield abort error
        // which we are not interested in
    }
	return res
}
