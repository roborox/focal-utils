import { extractIdsFromArray } from "./ids"
import { Map } from "immutable"
import { Atom } from "@grammarly/focal"

interface Entity {
	id: string
	value: string
}

describe("extractIdsFromArray", () => {
	test("should insert new items to map", () => {
		const atom = Atom.create(Map<string, Entity>())
		const ids = extractIdsFromArray([{id: "id1", value: "value1"}], atom)
		expect(ids).toStrictEqual(["id1"])
		expect(atom.get().size).toBe(1)
		expect(atom.get().get("id1")?.value).toBe("value1")
	})

	test("should update items", () => {
		const atom = Atom.create(Map<string, Entity>())
		atom.modify(x => x.set("id1", {id: "id1", value: "value10"}))
		const ids = extractIdsFromArray([{id: "id1", value: "value11"}], atom)
		expect(ids).toStrictEqual(["id1"])
		expect(atom.get().size).toBe(1)
		expect(atom.get().get("id1")?.value).toBe("value11")
	})

	test("should leave exitsing items", () => {
		const atom = Atom.create(Map<string, Entity>())
		atom.modify(x => x.set("id1", {id: "id1", value: "value10"}))
		atom.modify(x => x.set("id2", {id: "id2", value: "value2"}))
		const ids = extractIdsFromArray([{id: "id1", value: "value11"}], atom)
		expect(ids).toStrictEqual(["id1"])
		expect(atom.get().size).toBe(2)
		expect(atom.get().get("id1")?.value).toBe("value11")
		expect(atom.get().get("id2")?.value).toBe("value2")
	})

})
