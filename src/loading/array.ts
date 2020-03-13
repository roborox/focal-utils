import { Atom } from "@grammarly/focal"
import { Map } from "immutable"
import { LoadAtoms, loadFull } from "./index"
import { LoadingState } from "./domain"

interface HasId<T> {
	id: T
}

interface ArrayAtoms<Id, T extends HasId<Id>> extends LoadAtoms<Id[]> {
	map: Atom<Map<Id, T>>
}

export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: Atom<LoadingState<Id[]>>,
	map: Atom<Map<Id, T>>
): Promise<void>
export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ArrayAtoms<Id, T>,
): Promise<void>
export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ArrayAtoms<Id, T> | Atom<LoadingState<Id[]>>,
	map?: Atom<Map<Id, T>>,
) {
	const atoms = "get" in value ? arrayStateToAtoms(value, map!!) : value
	await loadFull(
		promise,
		xs => xs.map((x) => x.id),
		atoms,
		xs => atoms.map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
	)
}

export const arrayStateToAtoms = <Id, T extends HasId<Id>>(
	state: Atom<LoadingState<Id[]>>,
	map: Atom<Map<Id, T>>,
): ArrayAtoms<Id, T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
	map,
})