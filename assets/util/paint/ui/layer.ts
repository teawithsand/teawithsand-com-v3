import { DrawableElement } from "../primitive";

export class Layer implements ReadOnlyLayer {
    public name: string
    public elements: DrawableElement[] = []
    public isLocked = false
    public isHidden = false
}

export interface ReadOnlyLayer {
    readonly elements: DrawableElement[] 
    readonly isLocked: boolean
    readonly isHidden: boolean
}