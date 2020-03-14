import { Map } from "immutable"
import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"
import { loadArray } from "./array"
import { loadingStatusIdle, loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"

type Data = {
	id: string
}

const data = ["0", "1", "2"].map((id) => ({ id }))

describe("loadArray", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const ids = Atom.create<LoadingState<string[]>>({
			status: loadingStatusIdle,
			value: [],
		})
		const map = Atom.create(Map<string, Data>())
		await loadArray(Promise.resolve(data), ids, map)
		expect(ids.get()).toEqual({
			status: loadingStatusSuccess,
			value: ["0", "1", "2"],
		})
	})
})
