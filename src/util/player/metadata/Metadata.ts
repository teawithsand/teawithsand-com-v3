type Metadata = {
	duration: number | null
}

export enum MetadataLoadingResultType {
	OK = 1,
	ERROR = 2,
}

export type MetadataLoadingResult =
	| {
			type: MetadataLoadingResultType.OK
			metadata: Metadata
	  }
	| {
			type: MetadataLoadingResultType.ERROR
			error: any
	  }

export default Metadata
