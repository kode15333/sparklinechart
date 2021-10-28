import React from "react"

type Margin = "top" | "left" | "right" | "bottom"

type Props = {
    /** width */
    width: number
    /** height */
    height: number
    /** margin*/
    margin: Record<Margin, number>
    /** strokeWidth*/
    strokeWidth: number
    /** spotRadios */
    spotRadius?: number
    /** cursorWidth */
    cursorWidth?: number
}

type Data = {
    value: number
    date: Date
}

function Chart({
    data,
    height,
    width,
    margin,
    strokeWidth,
    spotRadius = 2,
}: Props) {
    console.log(data, height, width, margin, strokeWidth, spotRadius)
    return <div></div>
}

export default Chart
