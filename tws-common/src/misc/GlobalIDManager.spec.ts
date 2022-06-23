import { GlobalIdManager, NS_REDUX_ACTION, NS_STORE } from "./GlobalIDManager"

describe("GlobalIDManager", () => {
	beforeEach(() => {
		GlobalIdManager.reset()
	})

	it("allows claiming same id in different ns", () => {
		GlobalIdManager.claimId(NS_STORE, "some-id")
		GlobalIdManager.claimId(NS_REDUX_ACTION, "some-id")
	})

	it("disallows same id in same ns", () => {
		GlobalIdManager.claimId(NS_STORE, "some-id")
		try {
			GlobalIdManager.claimId(NS_STORE, "some-id")
		} catch (e) {
			return
		}
		throw new Error("can't reach here")
	})
})
