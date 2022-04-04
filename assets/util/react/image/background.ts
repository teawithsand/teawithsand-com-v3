import { ImageSource } from "./ImageUtil";

export const getBackgroundImageStyle = (source: ImageSource): {
    backgroundImage: string,
} => {
    let src: string | undefined = undefined
    if (typeof source === "string") {
        src = source
    } else {
        src = source.src
    }

    return {
        backgroundImage: `url(${src})`,
    }
}