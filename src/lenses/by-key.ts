import { Map } from "immutable"
import { Lens } from "@grammarly/focal"

export function byKey<K, V>(k: K): Lens<Map<K, V>, V> {
	return Lens.create(
		it => it.get(k) as V,
		(it, map) => setWithCheck(k, it)(map),
	)
}

function setWithCheck<K, V>(key: K, value: V): (map: Map<K, V>) => Map<K, V> {
	return map => {
		const current = map.get(key)
		if (current !== value) {
			return map.set(key, value)
		} else {
			return map
		}
	}
}
