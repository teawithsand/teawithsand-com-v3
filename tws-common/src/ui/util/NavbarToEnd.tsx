import React from "react"
import styled from "styled-components"

const ToEndPaginator = styled.span`
	margin-left: auto;
`

/**
 * Util type, which has margin-left: auto and is useful when navbar entries have to be moved to the
 * right hand side.
 */
export const NavbarToEnd = () => <ToEndPaginator></ToEndPaginator>
