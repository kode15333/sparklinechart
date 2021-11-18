import { SVGAttributes } from "react"

export type Margin = "top" | "left" | "right" | "bottom"

export type DataType = {
    value: number
}

export type SVGElementAttr = {
    [key in keyof SVGAttributes<SVGElement>]: string
}

export type ChartData<T = number[]> = T extends number[] ? T : DataType[]

export type Position = {
    x: number
    y: number
}

export type EventMap<Element = HTMLElement> = Element extends Document
  ? DocumentEventMap
  : HTMLElementEventMap
