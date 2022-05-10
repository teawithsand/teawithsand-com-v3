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
