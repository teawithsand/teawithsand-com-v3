export class ErrorWallManager {
	constructor(
		public readonly parent: ErrorWallManager | null,
		private readonly onErrorsChanged: (errors: any[]) => void,
	) {}

	private errors: any[] = []

	clear = () => {
		this.errors = []
		this.onErrorsChanged(this.errors)
	}

	removeError = (error: any) => {
		this.errors = this.errors.filter(e => e !== error)
	}

	addError = (error: any) => {
		this.errors = [...this.errors, error]
		this.onErrorsChanged(this.errors)

		return () => {
			this.errors = this.errors.filter(e => error !== e)
		}
	}

	/**
	 * Creates promise, which adds error to this manager, if error occurred.
	 * Returned promise still throws.
	 */
	addErrorFromPromise = async <T>(promise: Promise<T>): Promise<T> => {
		try {
			return await promise
		} catch (e) {
			this.addError(e)
			throw e
		}
	}
}
