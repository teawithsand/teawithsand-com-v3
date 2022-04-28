export interface QuadTreeAdapter<T> {
    extractPoint(data: T): [number, number]
}

type Root = []

type Node<T> = {
    type: "value",
    data: T
} | {
    type: "node",
    quarters: [Node<T>, Node<T>, Node<T>, Node<T>],
}

/**
 * Quad tree implementation, obviously for 2d points.
 */
export class QuadTree<T> {
    private root: Node<T> | null = null

    constructor() { 
        throw new Error("NIY")
    }
}