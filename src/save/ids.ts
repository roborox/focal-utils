import { HasId } from "./domain"
import { Atom } from "@grammarly/focal"
import { Map } from "immutable"

export function extractIdsFromArray<Id, T extends HasId<Id>>(array: T[], map: Atom<Map<Id, T>>) {
	const newMap = Map<Id, T>(array.map(x => [x.id, x]))
	map.modify(x => x.merge(newMap))
	return array.map(x => x.id)
}
