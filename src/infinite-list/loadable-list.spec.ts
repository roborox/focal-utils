import { Atom } from "@grammarly/focal"
import { loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"
import { createLoadNext, ListPartLoader } from "./loadable-list"
import { api, ApiData, LoadPageContinuation } from "../../test/fixtures/api"
import { InfiniteListState, listStateIdle } from "./domain"

type MyListState = InfiniteListState<ApiData, LoadPageContinuation>

let appState: Atom<MyListState>

describe("loadable-list", () => {
	beforeEach(() => {
		appState = Atom.create(listStateIdle())
	})

	test("Should create new loadable list", async () => {
		expect.assertions(4)
		const loader: ListPartLoader<ApiData, LoadPageContinuation> = async (continuation) => {
			const page = continuation || 0
			const nextItems = await api.loadPage(page, 10)
			return [nextItems, page + 1]
		}
		const load = createLoadNext<ApiData, LoadPageContinuation>(loader, appState)

		expect(appState.get()).toEqual(listStateIdle())

		await load()
		const firstPage = await api.loadPage(0, 10)

		expect(appState.get().status).toEqual(loadingStatusSuccess)
		expect(appState.get().continuation).toEqual(1)
		expect(appState.get().items).toEqual(firstPage)
	})

	test("Should fail request", async () => {
		expect.assertions(3)
		const ERROR_MESSAGE = "error"

		const loader: ListPartLoader<ApiData, LoadPageContinuation> = async () => {
			throw ERROR_MESSAGE
		}

		const load = createLoadNext<ApiData, LoadPageContinuation>(loader, appState)
		await load()

		const state = appState.get()
		expect(state.status).toEqual({
			status: "error",
			error: ERROR_MESSAGE,
		})
		expect(state.items).toEqual([])
		expect(state.continuation).toEqual(null)
	})
})
