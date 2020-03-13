import { Atom } from "@grammarly/focal"
import { createLoadableList, LoadableListLoader, LoadableListState, loadableListStateIdle } from "./loadable-list"
import { api, ApiData, LoadPageContinuation } from "../../test/fixtures/api"
import { loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"

type MyListState = LoadableListState<ApiData, LoadPageContinuation>

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
		expect.assertions(4)
		const loader: LoadableListLoader<ApiData, LoadPageContinuation> = async (continuation) => {
			const page = continuation || 0
			const nextItems = await api.loadPage(page, 10)
			return [nextItems, page + 1]
		}
		const load = createLoadableList<ApiData, LoadPageContinuation>(loader, appState.lens("myList"))

		const myListLens = appState.lens("myList")
		expect(myListLens.get()).toEqual(loadableListStateIdle())

		await load()
		const firstPage = await api.loadPage(0, 10)

		expect(myListLens.get().status).toEqual(loadingStatusSuccess)
		expect(myListLens.get().continuation).toEqual(1)
		expect(myListLens.get().items).toEqual(firstPage)
	})

	test("Should fail request", async () => {
		expect.assertions(3)
		const ERROR_MESSAGE = "error"

		const loader: LoadableListLoader<ApiData, LoadPageContinuation> = async () => {
			throw ERROR_MESSAGE
		}

		const load = createLoadableList<ApiData, LoadPageContinuation>(loader, appState.lens("myList"))
		const myListLens = appState.lens("myList")

		await load()

		const state = myListLens.get()
		expect(state.status).toEqual({
			status: "error",
			error: ERROR_MESSAGE,
		})
		expect(state.items).toEqual([])
		expect(state.continuation).toEqual(null)
	})
})
