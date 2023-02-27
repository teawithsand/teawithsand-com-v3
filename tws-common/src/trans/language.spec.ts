import {
	languages,
	parseLanguage,
	recoverLanguageFromString,
	simplifyLanguage,
	unsimplifyLanguage,
} from "tws-common/trans/language"

describe("language", () => {
	it("can parse all languages", () => {
		for (const [l, s] of languages) {
			const parsed = parseLanguage(l)

			expect(parsed.simpleLanguage).toStrictEqual(s)
			expect(parsed.language).toStrictEqual(l)

			expect(simplifyLanguage(parsed.language)).toStrictEqual(s)
			expect(unsimplifyLanguage(parsed.simpleLanguage)).toStrictEqual(l)
		}
	})

	it("can recover language from string", () => {
		expect(recoverLanguageFromString("en")).toStrictEqual("en-US")
		expect(recoverLanguageFromString("En")).toStrictEqual("en-US")
		expect(recoverLanguageFromString("EN-US")).toStrictEqual("en-US")
		expect(recoverLanguageFromString("EN-us")).toStrictEqual("en-US")
		expect(recoverLanguageFromString("xx-XX")).toStrictEqual(null)
	})
})
