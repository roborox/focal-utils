import { LoadingState } from "./domain"
import { Atom } from "@grammarly/focal/dist/_cjs/src/atom"
import { Map } from "immutable"
import { loadArray } from "./array"

type Simple = {id: string}

describe("loadArray", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const ids = Atom.create<LoadingState<string[]>>({loading: false})
		const map = Atom.create(Map<string, Simple>())

		const loadAsync = async () => ([{id: "1"}, {"id": 2}] as Simple[])
		await loadArray(loadAsync(), ids, map)
		expect(ids.get()).toBeTruthy()
	})
})
