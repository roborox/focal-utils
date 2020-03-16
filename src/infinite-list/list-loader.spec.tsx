import React from "react"
import { Atom } from "@grammarly/focal"
import { act } from "react-dom/test-utils"
import { render, waitForElement } from "@testing-library/react"
import { LoadPageContinuation, ApiData, api } from "../../test/fixtures/api"
import { createLoadNext, ListPartLoader } from "./create-load-next"
import { ListLoader } from "./list-loader"
import { InfiniteListState, listStateIdle } from "./domain"

type MyListState = InfiniteListState<ApiData, LoadPageContinuation>

let appState = Atom.create<MyListState>(listStateIdle())

const loader: ListPartLoader<ApiData, LoadPageContinuation> = async (continuation) => {
	const page = continuation || 0
	const nextItems = await api.loadPage(page, 10)
	return [nextItems, page + 1]
}
const load = createLoadNext<ApiData, LoadPageContinuation>(loader, appState)

describe("list-loader", () => {
	beforeEach(() => appState.set(listStateIdle()))

	test("should create ListLoader and fetch some data", async () => {
		expect.assertions(4)
		const tree = render(
			<ListLoader
				state={appState}
				loading={<span data-testid="loading">loading</span>}
				idle={<span data-testid="idle">idle</span>}
			>
				<span data-testid="content">content</span>
			</ListLoader>,
		)

		expect(tree.getByTestId("idle")).toBeTruthy()
		act(() => {
			load()
		})
		expect(tree.getByTestId("loading")).toBeTruthy()
		await waitForElement(() => tree.getByTestId("content"))
		expect(tree.getByTestId("content")).toBeTruthy()

		act(() => {
			load()
		})
		expect(tree.getByTestId("content")).toBeTruthy()
	})
})
