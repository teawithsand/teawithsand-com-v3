import { unwrap } from "idb/with-async-ittr"

type Base = {
	done: Promise<unknown>
	commit: () => void
	abort: () => void
}

export function preventTransactionCloseOnError<T>(
	promise: Promise<T>,
): Promise<T> {
	const request = unwrap(promise)
	request.addEventListener("error", event => {
		event.preventDefault()
		event.stopPropagation()
	})
	return promise
}

export const useIDBPTransaction = async <T extends Base, E>(
	tx: T,
	cb: (tx: T) => Promise<E>,
): Promise<E> => {
	let isDone = false
	const done = tx.done
		.catch(e => {
			isDone = true
			return Promise.reject(e)
		})
		.then(v => {
			isDone = true
			return Promise.resolve(v)
		})

	let res: E

	try {
		res = await cb(tx)
	} catch (e) {
		try {
			if (!isDone) tx.abort()
		} catch (e) {
			// ignore it
		}
		throw e
	}
	try {
		if (!isDone) tx.commit()
		await done
	} catch (e) {
		//ignore
	}
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
