export enum FSEntryType {
	FILE = 1,
	SYMLINK = 2,
	DIR = 4,

	// we do not support other things like block devices
	// unlike linux
}

type PathInfo =
	| {
			type: FSEntryType.FILE
			size: number
	  }
	| {
			type: FSEntryType.DIR
	  }
	| {
			type: FSEntryType.SYMLINK
			to: string
	  }

export default PathInfo
