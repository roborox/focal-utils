import React from "react"
import { render } from "@testing-library/react"
import { Atom } from "@grammarly/focal/dist/_cjs/src/atom"
import { act } from "react-dom/test-utils"
import { lift } from "./lift"

const Text = ({value}: { value: string }) => {
	return <span data-testid="value">{value}</span>
}

const RxText = lift(Text, "value")

describe("lift", () => {
	test("should lift components", () => {
		const text = Math.random().toString()
		const atom = Atom.create(text)
		const r = render(<RxText value={atom}/>)
		expect(r.getByTestId("value")).toHaveTextContent(text)
		const nextText = Math.random().toString()
		act(() => atom.set(nextText))
		expect(r.getByTestId("value")).toHaveTextContent(nextText)
	})
})
