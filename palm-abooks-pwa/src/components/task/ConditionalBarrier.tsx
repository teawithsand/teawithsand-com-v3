import React from "react"

import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"

export type ConditionalBarrierProps = (
	| {
			type: "loaded"
	  }
	| {
			type: "loading"
			loadingText?: string
	  }
) & {
	children?: React.ReactNode | React.ReactFragment | null | undefined
}

const ConditionalBarrier = (props: ConditionalBarrierProps) => {
	if (props.type === "loading") {
		// TODO(teawithsand): make use of loadingText prop
		return <LoadingSpinner />
	}
	return <>{props.children}</>
}

export default ConditionalBarrier
