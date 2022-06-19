import { generateUUID } from "tws-common/lang/uuid"

class DocumentTitleHelperImpl {
	constructor() {
		// noop
	}

	private claims: {
		id: string
		priority: number
		value: string
	}[] = []

	private syncWindowTitle = () => {
		if (this.claims.length > 0) {
			document.title = this.claims[0].value
		}
	}

	/**
	 * Creates window title claim.
	 * It sets window title, if it has highest priority, otherwise it's ignored.
	 *
	 * Behavior is undefined if priorities are equal.
	 */
	createClaim = (
		priority: number,
		initValue: string,
	): {
		setTitle: (newValue: string) => void
		release: () => void
	} => {
		const claim = {
			id: generateUUID(),
			priority,
			value: initValue,
		}
		this.claims.push(claim)
		this.claims.sort((a, b) => -(a.priority - b.priority))

		this.syncWindowTitle()

		let isReleased = false
		return {
			setTitle: title => {
				if (claim.value !== title) {
					claim.value = title
					this.syncWindowTitle()
				}
			},
			release: () => {
				if (!isReleased) {
					this.claims = this.claims.filter(
						someClaim => someClaim.id !== claim.id,
					)
					isReleased = true
				}
			},
		}
	}
}

export const DocumentTitleHelper = new DocumentTitleHelperImpl()
