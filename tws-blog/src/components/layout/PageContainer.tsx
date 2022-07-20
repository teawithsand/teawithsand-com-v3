import React, { ReactFragment, ReactNode } from "react"

import { Container as ParentContainer } from "tws-common/ui"

const PageContainer = (props: { children?: ReactFragment | ReactNode }) => {
	return <ParentContainer className="mt-3">{props.children}</ParentContainer>
}
export default PageContainer
