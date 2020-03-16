import { Atom } from "@grammarly/focal"
import { loadingStatusIdle } from "@roborox/rxjs-react/build/to-rx"
import { LoadingState } from "./domain"
import { load } from "./index"
import { api, ApiData } from "../../test/fixtures/api"

describe("Load", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | ApiData[]>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(api.loadPage(0, 5), state)
		expect(state.get().value).toBeTruthy()
	})

	test("should load to Atoms", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | ApiData[]>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(api.loadPage(0, 5), {
			value: state.lens("value"),
			status: state.lens("status"),
		})
		expect(state.get().value).toBeTruthy()
	})
})
