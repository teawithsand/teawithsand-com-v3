declare module "*.module.scss"
declare module "*.svg" {
	export default React.PureComponent
}

declare const __PATH_PREFIX__: string

declare module "*.apk" {
	const fooUrl: string
	namespace fooUrl {}
	export = fooUrl
}

declare module 'service-worker-loader!*' {
    const register: import('service-worker-loader/types').ServiceWorkerRegister;
    const ServiceWorkerNoSupportError: import('service-worker-loader/types').ServiceWorkerNoSupportError;
    const scriptUrl: import('service-worker-loader/types').ScriptUrl;
    export default register;
    export {
        ServiceWorkerNoSupportError,
        scriptUrl
    };
}
// or, for example
declare module '*?sw' {
    // ...
}