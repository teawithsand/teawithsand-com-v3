const alphabeth = "abcdefghijklmnopqrstuvwxyz0123456789"

export const randomString = (min: number, max: number, spaces = false): string => {
    [min, max] = [Math.min(min, max), Math.max(min, max)]


    const length = min === max ? min : Math.round((Math.random() * max * 10)) % (max - min) + min
    let s = ""

    let chars = alphabeth
    if (spaces) {
        chars = chars + " ".repeat(Math.round(5)) // increase propability to get space
    }

    for (let i = 0; i < length; i++) {
        const c = Math.round((Math.random() * chars.length * 10)) % chars.length
        s += chars[c]
    }
    return s
}

export const shortRandomString = () => randomString(10, 15)
export const descriptionRandomString = () => randomString(100, 200, true)