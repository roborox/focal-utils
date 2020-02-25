export interface LoadingState<T> {
	loading: boolean
	value?: T
	error?: any
}
