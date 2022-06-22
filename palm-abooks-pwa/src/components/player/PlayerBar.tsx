import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { playerUiSetShownModal } from "@app/domain/redux/playerUi"
import { useAppTranslation } from "@app/trans/AppTranslation"

import { Button, ButtonGroup } from "tws-common/ui"

const BarWrapper = styled.div`
	overflow-x: visible;
`

const PlayerBar = () => {
	const translations = useAppTranslation()
	const dispatch = useDispatch()

	return (
		<BarWrapper>
			<ButtonGroup>
				<Button
					onClick={() => {
						dispatch(playerUiSetShownModal("speed"))
					}}
				>
					{translations.player.optionsBar.speed}
				</Button>
				{/*
                    Howto dropdown:
                    <Dropdown as={ButtonGroup}>
					<Dropdown.Toggle id="dropdown-autoclose-true">
						Default Dropdown
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#">Menu Item</Dropdown.Item>
						<Dropdown.Item href="#">Menu Item</Dropdown.Item>
						<Dropdown.Item href="#">Menu Item</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>*/}
			</ButtonGroup>
		</BarWrapper>
	)
}

export default PlayerBar
