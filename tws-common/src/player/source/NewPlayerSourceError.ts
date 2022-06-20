import { ExtendableBuiltin } from "tws-common/lang/extendable"

export default class NewPlayerSourceError extends ExtendableBuiltin(Error) {
	constructor(msg: string) {
		super(msg)
		this.name = "PlayerSourceError"
	}
}
