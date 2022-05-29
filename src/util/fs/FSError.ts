export enum FSErrorCode {
	NOT_EXIST = 1,
	INVALID_STATE = 2,
	NOT_SET_UP = 3,
	UNSUPPORTED_OPERATION = 4,
	OUT_OF_SPACE = 5,
	GENERAL_FAILURE = 6, // AKA unknown error
}

export default class FSError extends Error {
	constructor(msg: string, public readonly fileStoreCode: FSErrorCode) {
		super(msg)
		this.name = "FSError"
	}
}
