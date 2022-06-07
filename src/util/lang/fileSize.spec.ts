import { formatFileSize } from "@app/util/lang/fileSize"

describe("file size format util", () => {
	it.each([
		[1024, "1KB"],
		[1024 * 2, "2KB"],
		[1024 * 128, "128KB"],
		[1024 ** 2 * 128, "128MB"],
		[1024 ** 2 * 128 + 1024 ** 2 / 2 - 1, "128MB"],
		[1024 ** 2 * 128 + 1024 ** 2 / 2, "129MB"],
	])("formats file size ok", (size, res) => {
		expect(formatFileSize(size)).toStrictEqual(res)
	})
})
