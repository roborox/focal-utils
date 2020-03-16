export {
	LoadingState,
	LoadingStatus,
} from "@roborox/rxjs-react/build/to-rx"

export type LoaderCases<R> = {
	idle?: R
	loading?: R
	error?: (error: any) => R
	success: R
}

export interface HasId<T> {
	id: T
}
