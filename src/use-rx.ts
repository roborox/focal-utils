import { Observable } from "rxjs"
import { useEffect, useState } from "react"
import { Atom } from "@grammarly/focal"

export function useRx<T>(atom: Atom<T>): T
export function useRx<T>(observable: Observable<T>): T | null
export function useRx<T>(observable: Observable<T>, initial: T): T
export function useRx<T>(observable: Observable<T>, initial?: T): T | null {
	const [state, setState] = useState<T | null>(() => {
		let initialState: T | null = null
		if (initial !== undefined) {
			initialState = initial
		} else if ((observable as any)["get"] !== undefined) {
			initialState = (observable as any).get()
		}
		return initialState
	})
	useEffect(() => {
		const subscription = observable.subscribe(setState)
		return () => {
			subscription.unsubscribe()
		}
	}, [])
	return state
}
