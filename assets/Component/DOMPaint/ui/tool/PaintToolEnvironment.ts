import UIState from "../UIState"

type PaintToolEnvironment = {
    parentElementRef: { readonly current: HTMLElement },
    uiState: UIState,
}

export default PaintToolEnvironment