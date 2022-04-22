import { Color } from "@app/util/paint/color"
import React from "react"

import styles from "./paintPanel.scss?module"

export type PaintPanelAction = {
    type: "pick-fill-color",
    color: Color,
}

export default (props: {
    actionCallback: (action: PaintPanelAction) => void,
}) => {
    return <div className={styles.panel}>
        
    </div>
}