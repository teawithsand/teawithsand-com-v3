import React, { ReactElement, ReactFragment, ReactNode } from "react"

import ConditionalBarrier from "@app/components/task/ConditionalBarrier"
import { ABookGTaskRunnerBus } from "@app/domain/gtask"

import useStickySubscribable from "tws-common/react/hook/useStickySubscribable"

const ABookTaskBarrier = (props: {
	children: ReactNode | ReactElement | ReactFragment | null | undefined
}) => {
	const currentTask = useStickySubscribable(ABookGTaskRunnerBus)
	return (
		<ConditionalBarrier type={currentTask !== null ? "loading" : "loaded"}>
			{props.children}
		</ConditionalBarrier>
	)
}

export default ABookTaskBarrier
