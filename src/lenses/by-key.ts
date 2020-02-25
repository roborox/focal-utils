import { Map } from "immutable"
import { Lens, Option } from "@grammarly/focal"

export function byKey<K, V>(k: K): Lens<Map<K, V>, V> {
	return Lens.create(
		it => it.get(k) as V,
		(it, map) => setWithCheck(k, it)(map),
	)
}

export function byKeyPartial<K, V>(k: K): Lens<Map<K, V>, Option<V>> {
	return Lens.create(
		it => it.get(k),
		(it, map) => setWithCheck(k, it)(map),
	)
}

function setWithCheck<K, V>(key: K, value: Option<V>): (map: Map<K, V>) => Map<K, V> {
	return map => {
		const current = map.get(key)
		if (current !== value) {
			if (value === undefined) {
				return map.remove(key)
			} else {
				return map.set(key, value)
			}
		} else {
			return map
		}
	}
}
