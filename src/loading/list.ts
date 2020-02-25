import { Atom } from "@grammarly/focal"
import { from, List } from "list/methods"
import { Map } from "immutable"
import { loadFull } from "./index"
import { LoadingState } from "./domain"

interface HasId<T> {
	id: T
}

export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	ids: Atom<LoadingState<List<Id>>>,
	map: Atom<Map<Id, T>>,
) {
	await loadFull(
		promise,
		ids,
		xs => from(xs.map((x) => x.id)),
		xs => map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
	)
}
