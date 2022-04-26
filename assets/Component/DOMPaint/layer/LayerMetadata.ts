import { GenerateUUID } from "@app/util/lang/uuid"

export default class PaintLayerMetadata {
    public isHidden: boolean
    public name: string
    constructor(data?: {
        isHidden?: boolean,
        name?: string,
    }) {
        this.isHidden = data?.isHidden ?? false
        this.name = data?.name ?? "layer-" + GenerateUUID()
    }

    copy = () => new PaintLayerMetadata({
        isHidden: this.isHidden,
        name: this.name,
    })
}