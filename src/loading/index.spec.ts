import { Atom } from "@grammarly/focal/dist/_cjs/src/atom"
import { LoadingState } from "./domain"
import { load } from "./index"

describe("Load", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const asyncLoad = async () => 1
		const state = Atom.create<LoadingState<number>>({loading: false})
		await load(asyncLoad(), state)
		expect(state.get().value).toBeTruthy()
	})

	test("should load to Atoms", async () => {
		expect.assertions(1)
		const asyncLoad = async () => 1
		const state = Atom.create<LoadingState<number>>({loading: false})
		await load(asyncLoad(), { value: state.lens("value") })
		expect(state.get().value).toBeTruthy()
	})
})
