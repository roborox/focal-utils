import { Atom } from "@grammarly/focal"
import { HasId, LoadingState } from "./domain"
import { Atoms, save } from "./index"
import { extractIds } from "./ids"
import { Map } from "immutable"

export interface ArrayAtoms<Id, T extends HasId<Id>> extends Atoms<Id[]> {
	map?: Atom<Map<Id, T>>
}

export function saveArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ArrayAtoms<Id, T>,
): Promise<void>
export function saveArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: Atom<LoadingState<Id[]>>,
	map: Atom<Map<Id, T>>
): Promise<void>
export function saveArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	value: ArrayAtoms<Id, T> | Atom<LoadingState<Id[]>>,
	map?: Atom<Map<Id, T>>,
): Promise<void> {
	const atoms = "get" in value ? arrayStateToAtoms(value, map) : value
	return save(
		promise.then(x => extractIds<Id, T>(x, atoms.map)),
		atoms,
	)
}

export const arrayStateToAtoms = <Id, T extends HasId<Id>>(
	state: Atom<LoadingState<Id[]>>,
	map?: Atom<Map<Id, T>>,
): ArrayAtoms<Id, T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
	map,
})
