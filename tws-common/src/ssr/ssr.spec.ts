import { isSSR } from "tws-common/ssr"

describe("SSR", () => {
	it("isSSR returns false when testing", () => {
		expect(isSSR()).toBe(false)
	})
})
