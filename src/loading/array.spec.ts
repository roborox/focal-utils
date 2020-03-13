import { Map } from "immutable"
import { Atom } from "@grammarly/focal"
import { loadingStatusIdle, loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"
import { LoadingState } from "./domain"
import { loadArray } from "./array"

type Data = {
	id: string
}

const data = ["0", "1", "2"].map((id) => ({ id }))

const fetchData = () => new Promise<Data[]>((resolve) => setTimeout(() => {
	resolve(data)
}, 500))

describe("loadArray", () => {
	test("should load to LoadingState", async () => {
		expect.assertions(1)
		const ids = Atom.create<LoadingState<string[]>>({
			status: loadingStatusIdle,
			value: [],
		})
		const map = Atom.create(Map<string, Data>())
		await loadArray(fetchData(), ids, map)
		expect(ids.get()).toEqual({
			status: loadingStatusSuccess,
			value: ["0", "1", "2"],
		})
	})
})
