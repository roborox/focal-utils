import { Atom } from "@grammarly/focal"
import { LoadableListLoader, createLoadableList, LoadableListState, loadableListStateIdle } from "./loadable-list"
import { LoadPageContinuation, ApiData, api } from "../../test/fixtures/api"

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
		expect.assertions(2)
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

		expect(myListLens.get().loadingState).toEqual({
			status: {
				status: "success",
			},
			value: [firstPage, 1],
		})
	})

	test("Should fail request", async () => {
		expect.assertions(3)
		const ERROR_MESSAGE = "error"

		const loader: LoadableListLoader<ApiData, LoadPageContinuation> = async () => {
			throw new Error(ERROR_MESSAGE)
		}

		const load = createLoadableList<ApiData, LoadPageContinuation>(loader, appState.lens("myList"))
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