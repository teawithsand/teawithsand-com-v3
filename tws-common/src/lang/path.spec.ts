import { absolutizePath } from "tws-common/lang/path";


describe("absolutizePath", () => {
	it("absolutizes path with protocol", () => {
		expect(
			absolutizePath("https://teawithsand.com", "/asdf"),
		).toStrictEqual("https://teawithsand.com/asdf")
		expect(
			absolutizePath("https://teawithsand.com", "/asdf", {
				protocol: "http",
			}),
		).toStrictEqual("http://teawithsand.com/asdf")
	})
})