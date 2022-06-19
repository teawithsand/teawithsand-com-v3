import React, { ReactFragment, ReactNode } from "react"

import { Container as ParentContainer } from "tws-common/ui"

const PageContainer = (props: { children?: ReactFragment | ReactNode }) => {
	return <ParentContainer className="mt-5">{props.children}</ParentContainer>
}
export default PageContainer
