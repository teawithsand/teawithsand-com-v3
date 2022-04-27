export type GenerationalIndex = Readonly<{
    index: number,
    generation: number,
}>

type Entry<T> = {
    data: T,
    generation: number,
} | null

/**
 * Generational index array which supports getting and removing elements from it.
 * 
 * Note: for now it never shrinks, so if it reaches certain size, it won't get smaller, even though empty slots are reused.
 * Before you use it, make sure it won't get too big.
 * 
 * Note 2: now it can be fixed, with useJsDelete, but it makes array holey and it even may become just dictionary(in js engine internally), which 
 * makes it slow.
 */
export default class GenerationalIndexArray<T> {
    private freeList: number[] = []
    private container: Entry<T>[] = []
    private generationCounter: number = 0

    constructor(private readonly useJsDelete: boolean = false) {
    }

    // TODO(teawithsand): redesign this for fast iteration:
    //  make each element and top level class contain head and tail fields, so we can jump using them
    //  so iterating over all elements is fast, even when useJsDelete is not set

    [Symbol.iterator]() {
        const list = this.container
        const generation = this.generationCounter
        function* gen() {
            for (const e of list) {
                if (e === null || e === undefined)
                    continue;
                    
                // element was inserted after we started iterating
                if (e.generation > generation) {
                    continue;
                }

                yield e.data
            }
        }

        return gen()
    };

    push = (e: T): GenerationalIndex => {
        const gen = this.generationCounter

        let index: number
        if (!this.useJsDelete && this.freeList.length > 0) {
            index = this.freeList[this.freeList.length - 1]
            this.freeList.pop()
            this.container[index] = {
                data: e,
                generation: gen,
            }
        } else {
            this.container.push({
                data: e,
                generation: gen,
            })
            index = this.container.length - 1
        }

        this.generationCounter++

        return {
            generation: gen,
            index: index,
        }
    }

    removeAt = (i: GenerationalIndex): boolean => {
        const oldEntry = this.container[i.index]
        if (oldEntry === null) {
            return false
        }
        if (oldEntry.generation !== i.generation) {
            return false
        }

        if (this.useJsDelete) {
            delete this.container[i.index]
        } else {
            this.freeList.push(i.index)
            this.container[i.index] = null
        }

        return true
    }

    at = (i: GenerationalIndex): T | null => {
        const e = this.container[i.index]
        if (e === null || e === undefined) {
            return null
        }
        if (e.generation !== i.generation) {
            return null
        }

        return e.data
    }
}