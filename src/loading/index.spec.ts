import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"
import { load } from "./index"
import { loadingStatusIdle } from "@roborox/rxjs-react/build/to-rx"

describe("Load", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | number>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(Promise.resolve(Math.random() * 100), state)
		expect(state.get().value).toBeTruthy()
	})

	test("should load to Atoms", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | number>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(Promise.resolve(Math.random() * 100), {
			value: state.lens("value"),
			status: state.lens("status"),
		})
		expect(state.get().value).toBeTruthy()
	})
})
