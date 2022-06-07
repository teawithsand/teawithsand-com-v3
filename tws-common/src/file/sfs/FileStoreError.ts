export enum FileStoreErrorCode {
	NOT_FOUND = 1,
}

export default class FileStoreError extends Error {
	constructor(
		msg: string,
		public readonly fileStoreCode: FileStoreErrorCode,
	) {
		super(msg)
		this.name = "FileStoreError"
	}
}
