import { ExtendableBuiltin } from "./extendable";

/**
 * Class to inherit from rather than error due to babel edge vase of inheritance of builtins.
 */
export default class BaseError extends ExtendableBuiltin(Error) {
	public readonly __isBaseError

	constructor(message: string) {
		super(message)

		this.name = this.constructor.name;

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}

		this.__isBaseError = true
	}
}

export const isBaseError = (e: any) => e !== null && typeof e === "object" && e.__isBaseError