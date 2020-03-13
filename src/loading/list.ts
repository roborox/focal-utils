import { Atom } from "@grammarly/focal"
import { from, List } from "list/methods"
import { Map } from "immutable"
import { LoadAtoms, loadFull } from "./index"
import { LoadingState } from "./domain"

interface HasId<T> {
	id: T
}

export interface ListAtoms<Id, T extends HasId<Id>> extends LoadAtoms<List<Id>> {
	map: Atom<Map<Id, T>>
}

export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ListAtoms<Id, T>,
): Promise<void>
export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: Atom<LoadingState<List<Id>>>,
	map: Atom<Map<Id, T>>,
): Promise<void>
export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ListAtoms<Id, T> | Atom<LoadingState<List<Id>>>,
	map?: Atom<Map<Id, T>>,
): Promise<void> {
	const atoms = "get" in value ? listStateToAtoms(value, map!!) : value
	await loadFull(
		promise,
		xs => from(xs.map((x) => x.id)),
		atoms,
		xs => atoms.map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
	)
}

export const listStateToAtoms = <Id, T extends HasId<Id>>(
	state: Atom<LoadingState<List<Id>>>,
	map: Atom<Map<Id, T>>,
): ListAtoms<Id, T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
	map,
})