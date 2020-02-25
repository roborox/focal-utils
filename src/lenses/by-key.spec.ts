import { byKey } from "./by-key"
import { Map } from "immutable"

describe("byKey Lens", () => {
	test("should not change Map if item not changed", () => {
		let initial = Math.random()
		const map = Map<string, number>().set("key", initial)
		const lens = byKey<string, number>("key")
		expect(lens.set(initial, map) === map).toBeTruthy()
		expect(lens.set(-1, map) !== map).toBeTruthy()
		expect(lens.set(-1, map).get("key")).toBe(-1)
	})
})
