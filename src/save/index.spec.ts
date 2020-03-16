import { Atom } from "@grammarly/focal"
import { loadingStatusIdle } from "@roborox/rxjs-react/build/to-rx"
import { api, ApiData } from "../../test/fixtures/api"
import { save } from "."
import { LoadingState } from "./domain"

describe("save", () => {
	test("should save data to atom", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | ApiData[]>>({
			status: loadingStatusIdle,
			value: null,
		})
		await save(api.loadPage(0, 5), state)
		expect(state.get().value).toBeTruthy()
	})

	test("should save to separate atoms", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | ApiData[]>>({
			status: loadingStatusIdle,
			value: null,
		})
		await save(api.loadPage(0, 5), {
			value: state.lens("value"),
			status: state.lens("status"),
		})
		expect(state.get().value).toBeTruthy()
	})
})
