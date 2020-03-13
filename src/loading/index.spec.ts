import { Atom } from "@grammarly/focal"
import { loadingStatusIdle } from "@roborox/rxjs-react/build/to-rx"
import { LoadingState } from "./domain"
import { load } from "./index"

const getAsyncRandomNumber = () => new Promise((resolve) => {
	setTimeout(() => {
		resolve(Math.random() * 100)
	}, 500)
})

describe("Load", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | number>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(getAsyncRandomNumber(), state)
		expect(state.get().value).toBeTruthy()
	})

	test("should load to Atoms", async () => {
		expect.assertions(1)
		const state = Atom.create<LoadingState<null | number>>({
			status: loadingStatusIdle,
			value: null,
		})
		await load(getAsyncRandomNumber(), {
			value: state.lens("value"),
			status: state.lens("status"),
		})
		expect(state.get().value).toBeTruthy()
	})
})
