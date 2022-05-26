export enum FileSystemErrorCode {
	NOT_FOUND = 1,
	ACCESS_DENIED = 2,
	INVALID_OPERATION = 3,
	INVALID_VALUE = 4,
	INVALID_STATE = 5,
}

export default class FileSystemError extends Error {
	constructor(
		msg: string,
		public readonly fileSystemCode: FileSystemErrorCode,
	) {
		super(msg)
		this.name = "FileSystemError"
	}
}
