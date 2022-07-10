import React, { ReactElement, ReactFragment, ReactNode } from "react"

import ErrorRenderer from "@app/components/layout/ErrorRenderer"
import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { DialogBoundary } from "tws-common/react/components/dialog"
import { ErrorWall } from "tws-common/react/components/error-wall"
import { SimpleSuspenseDiv } from "tws-common/react/components/suspense"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import LoadingSpinner from "tws-common/ui/LoadingSpinner"

const queryClient = new QueryClient()

GlobalIdManager.disable()

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AppNavbar />
				<SimpleSuspenseDiv fallback={() => <LoadingSpinner />}>
					<ErrorWall errorRenderer={ErrorRenderer}>
						<DialogBoundary>{props.children}</DialogBoundary>
					</ErrorWall>
				</SimpleSuspenseDiv>
			</QueryClientProvider>
		</>
	)
}

export default Layout
