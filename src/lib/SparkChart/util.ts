import { SVGElementAttr } from "./types"

export const getY = (
    max: number,
    height: number,
    diff: number,
    value: number
) => {
    return parseFloat((height - (value * height) / max + diff).toFixed(2))
}

export const buildElement = (tag: string, attrs: SVGElementAttr) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag)

    for (const [k, v] of Object.entries(attrs)) {
        element.setAttribute(k, v)
    }

    return element
}
