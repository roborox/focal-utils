import { LoadableListLoader, createLoadableList, LoadableListState, loadableListStateIdle } from "./loadable-list"
import { Atom } from "@grammarly/focal"
import { loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"

export type Data = {
	id: string,
	value: number
}

export type Continuation = number

const createApi = () => {
	const items = new Array(100).fill(1).map((_, index) => ({
		id: index.toString(),
		value: index,
	}) as Data)

	return {
		loadPage: (page: Continuation, perPage: number) =>
			Promise.resolve(items.slice(page * perPage, page * perPage + perPage)),
	}
}

type MyListState = LoadableListState<Data, Continuation>

let appState: Atom<{
	myList: MyListState
}>

describe("loadable-list", () => {
	beforeEach(() => {
		appState = Atom.create({
			myList: loadableListStateIdle(),
		})
	})

	test("Should create new loadable list", async () => {
		expect.assertions(2)
		const api = createApi()

		const loader: LoadableListLoader<Data, Continuation> = async (continuation) => {
			const page = continuation || 0
			const nextItems = await api.loadPage(page, 10)
			return [nextItems, page + 1]
		}
		const load = createLoadableList<Data, Continuation>(loader, appState.lens("myList"))

		const myListLens = appState.lens("myList")
		expect(myListLens.get()).toEqual(loadableListStateIdle())

		await load()
		const firstPage = await api.loadPage(0, 10)

		expect(myListLens.get().loadingState).toEqual({
			status: loadingStatusSuccess,
			value: [firstPage, 1],
		})
	})

	test("Should fail request", async () => {
		expect.assertions(3)
		const ERROR_MESSAGE = "error"

		const loader: LoadableListLoader<Data, Continuation> = async () => {
			throw new Error(ERROR_MESSAGE)
		}

		const load = createLoadableList<Data, Continuation>(loader, appState.lens("myList"))
		const myListLens = appState.lens("myList")

		await load()

		const state = myListLens.get().loadingState
		expect(state.value).toEqual([[], null])
		expect(state.status.status).toEqual("error")

		if (state.status.status === "error") {
			expect((state.status.error as Error).message).toEqual(ERROR_MESSAGE)
		}
	})
})