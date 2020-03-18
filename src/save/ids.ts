import { HasId } from "./domain"
import { Atom } from "@grammarly/focal"
import { Map } from "immutable"

export function extractIds<Id, T extends HasId<Id>>(array: T[], map?: Atom<Map<Id, T>>) {
	map?.modify(x => x.merge(Map<Id, T>(array.map(x => [x.id, x]))))
	return array.map(x => x.id)
}
