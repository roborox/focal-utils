import React from "react"
import { render } from "@testing-library/react"
import { Atom } from "@grammarly/focal/dist/_cjs/src/atom"
import { Rx } from "./rx"
import { act } from "react-dom/test-utils"

const Text = ({value}: { value: string }) => {
	return <span data-testid="value">{value}</span>
}

describe("Rx", () => {
	test("should observe reactive value", () => {
		const text = Math.random().toString()
		const atom = Atom.create(text)
		const r = render(<Rx value={atom}>{x => <Text value={x}/>}</Rx>)
		expect(r.getByTestId("value")).toHaveTextContent(text)
		const nextText = Math.random().toString()
		act(() => atom.set(nextText))
		expect(r.getByTestId("value")).toHaveTextContent(nextText)
	})
})
