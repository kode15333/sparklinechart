import React, { useEffect, useRef } from "react"
import { DataType, Margin } from "./types"
import { buildElement, getY } from "./util"

type Props<T = number> = {
    /** id */
    id: string
    /** data*/
    data: T extends number ? number[] : DataType[]
    /** width */
    width: number
    /** height */
    height: number
    /** margin*/
    margin?: Record<Margin, number>
}

const defaultProps = {
    strokeWidth: 2,
    spotRadius: 2,
    cursorWidth: 2,
}

function Chart<T>({
    id,
    data,
    height,
    width,
    strokeWidth,
}: Props<T> & typeof defaultProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const sparkLine = () => {
        const svg = svgRef.current as SVGSVGElement
        if (!data.length || !svg) return

        svg.innerHTML = ""

        const values = data.map((v) => {
            if (typeof v === "number") {
                return v
            }
            return v.value
        })

        const spotDiameter = 0

        const fullHeight = height

        const max = Math.max(...values)

        const lastItemIndex = values.length - 1

        const offset = width / lastItemIndex

        const pathY = getY(max, height, strokeWidth, values[0])
        let pathCoords = `M${spotDiameter} ${pathY}`

        values.forEach((value: number, index: number) => {
            const x = index * offset + spotDiameter
            const y = getY(max, height, strokeWidth, value)

            pathCoords += ` L ${x} ${y}`
        })

        const path = buildElement("path", {
            className: "sparkline--line",
            d: pathCoords,
            fill: "none",
        })

        const fillCoords = `${pathCoords} V ${fullHeight} L ${spotDiameter} ${fullHeight} Z`

        const fill = buildElement("path", {
            className: "sparkline--fill",
            d: fillCoords,
            stroke: "none",
        })

        svg.appendChild(fill)
        svg.appendChild(path)
    }

    useEffect(() => {
        sparkLine()
    }, [width, height])

    return <svg id={id} width={width} height={height} ref={svgRef} />
}

Chart.defaultProps = defaultProps

export default Chart
