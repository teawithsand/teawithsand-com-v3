import React from "react"
import styled from "styled-components"

import { ColorPickerInput } from "@app/components/util/ColorPicker"
import { PaintActionType } from "@app/domain/paint/defines/action"
import {
	useCurrentPaintSnapshotSelector,
	useDispatchAndCommitPaintActions,
} from "@app/domain/paint/redux/selector"

import { encodeColor } from "tws-common/color"
import { Form } from "tws-common/ui"

const InnerContainer = styled.div``

const FormRow = styled(Form.Group)`
	display: grid;
	grid-template-columns: auto auto;
	grid-auto-flow: row;
	gap: 0.6rem;

	align-items: center;
	justify-items: center;

	& > label {
		width: fit-content;
		padding: 0;
		margin: 0;
	}
`

export const GeneralToolSettingsPanel = () => {
	const strokeColor = useCurrentPaintSnapshotSelector(
		s => s.uiState.globalToolConfig.strokeColor,
	)

	const dispatch = useDispatchAndCommitPaintActions()

	return (
		<InnerContainer>
			<FormRow>
				<Form.Label>Stroke color</Form.Label>
				<ColorPickerInput
					value={strokeColor}
					onChange={c =>
						dispatch({
							type: PaintActionType.SET_STROKE_COLOR,
							color: c,
						})
					}
				/>
			</FormRow>
		</InnerContainer>
	)
}
