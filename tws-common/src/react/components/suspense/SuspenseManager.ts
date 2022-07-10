export class SuspenseManager {
	constructor(private readonly onCounterChanged: (ctr: number) => void) {}

	private counter = 0

	claim = () => {
		this.counter++
		this.onCounterChanged(this.counter)

		let isClosed = false
		return () => {
			if (isClosed) {
				return
			}
			this.counter--
			isClosed = true

			this.onCounterChanged(this.counter)
		}
	}

	/**
	 * Creates claim, which lasts until promise passed as argument is resolved.
	 */
	claimPromise = async <T>(promise: Promise<T>): Promise<T> => {
		const release = this.claim()
		try {
			return await promise
		} finally {
			release()
		}
	}
}
