/**
 * Util for performing various ops on canvas.
 */
export class CanvasUtil {
    constructor(private readonly canvas: HTMLCanvasElement) {
    }

    contentToBlobURL = (type: string, quality?: number) => {
        return new Promise((resolve, reject) => {
            try {
                this.canvas.toBlob((blob) => {
                    resolve(blob)
                }, type, quality)
            } catch (e) {
                reject(e)
            }
        })
    }

    contentToDataURL = (type: string, quality?: number) => {
        return new Promise((resolve, reject) => {
            let res
            try {
                res = this.canvas.toDataURL(type, quality)

            } catch (e) {
                reject(e)
            }
            resolve(res)
        })
    }
}