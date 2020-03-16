import { Map } from "immutable"
import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"
import { loadArray } from "./array"
import { loadingStatusIdle, loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"
import { api, apiItems, ApiData } from "../../test/fixtures/api"

describe("loadArray", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const ids = Atom.create<LoadingState<string[]>>({
			status: loadingStatusIdle,
			value: [],
		})
		const map = Atom.create(Map<string, ApiData>())
		await loadArray(api.loadPage(0, 5), ids, map)
		expect(ids.get()).toEqual({
			status: loadingStatusSuccess,
			value: apiItems.map((item) => item.id).slice(0, 5),
		})
	})
})
