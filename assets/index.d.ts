
// PNG support
declare module '*.png' {
    interface ResponsiveImageEntry {
        src: string,
        width: number,
        height: number,
    }

    interface ResponsiveImage {
        src: string,
        srcSet: string,
        images: ResponsiveImageEntry[],
    }    
    const fooImage: ResponsiveImage
    namespace fooImage { }
    export = fooImage
}

// JPG support
declare module '*.jpg' {
    interface ResponsiveImageEntry {
        src: string,
        width: number,
        height: number,
    }

    interface ResponsiveImage {
        src: string,
        srcSet: string,
        images: ResponsiveImageEntry[],
    }    
    const fooImage: ResponsiveImage
    namespace fooImage { }
    export = fooImage
}

// JPEG support
declare module '*.jpeg' {
    interface ResponsiveImageEntry {
        src: string,
        width: number,
        height: number,
    }

    interface ResponsiveImage {
        src: string,
        srcSet: string,
        images: ResponsiveImageEntry[],
    }    
    const fooImage: ResponsiveImage
    namespace fooImage { }
    export = fooImage
}

// WEBP support
declare module '*.webp' {
    interface ResponsiveImageEntry {
        src: string,
        width: number,
        height: number,
    }

    interface ResponsiveImage {
        src: string,
        srcSet: string,
        images: ResponsiveImageEntry[],
    }    
    const fooImage: ResponsiveImage
    namespace fooImage { }
    export = fooImage
}




// SVG support
declare module '*.svg' {
    const fooUrl: string
    namespace fooUrl { }
    export = fooUrl
}

declare module '*.apk' {
    const fooUrl: string
    namespace fooUrl { }
    export = fooUrl
}

// Recaptcha support
declare var grecaptcha: any;

// CSS/SCSS modules support
declare module '*.scss?module' {
    const styles: {
        [key: string]: string
    };
    export default styles;
}

declare module '*.css?module' {
    const styles: {
        [key: string]: string
    };
    export default styles;
}