import { SVGAttributes } from "react"

export type Margin = "top" | "left" | "right" | "bottom"

export type DataType = {
    value: number
}

export type SVGElementAttr = {
    [key in keyof SVGAttributes<SVGElement>]: string
}
