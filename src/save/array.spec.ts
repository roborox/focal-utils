import { Map } from "immutable"
import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"
import { api, apiItems, ApiData } from "../../test/fixtures/api"
import { createLoadingStateIdle, loadingStatusSuccess } from "@roborox/rxjs-react/build"
import { saveArray } from "./array"

describe("loadArray", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const ids = Atom.create<LoadingState<string[]>>(createLoadingStateIdle([]))
		const map = Atom.create(Map<string, ApiData>())
		await saveArray(api.loadPage(0, 5), ids, map)
		expect(ids.get()).toEqual({
			status: loadingStatusSuccess,
			value: apiItems.map((item) => item.id).slice(0, 5),
		})
	})
})
