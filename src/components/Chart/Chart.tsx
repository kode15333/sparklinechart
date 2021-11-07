import React, { RefObject, useEffect, useRef } from "react"
import { DataType, Margin } from "./types"
import { buildElement, getY } from "./util"
import { useWindowSize } from "../useWindowSize"

type ChartData<T = number[]> = T extends number[] ? T : DataType[]

type Props<T> = {
    /** id */
    id: string
    /** containerRef */
    containerRef: RefObject<HTMLElement>
    /** data*/
    data: ChartData<T>
    /** width */
    width?: number
    /** height */
    height?: number
    /** margin*/
    margin?: Record<Margin, number>
    /** fill */
    fill?: string
    /** interactive action with cursor*/
    interactive?: boolean
}

const defaultProps = {
    strokeWidth: 2,
    spotRadius: 2,
    cursorWidth: 2,
    margin: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
}

function Chart<T>({
    id,
    containerRef,
    data,
    height,
    width,
    margin,
    strokeWidth,
    spotRadius,
    fill,
    interactive,
}: Props<T> & typeof defaultProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [containerWidth, containerHeight] = useWindowSize(containerRef)

    const fullHeight = height || containerHeight
    const fullWidth = width || containerWidth

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

        const spotDiameter = spotRadius * 2

        const svgHeight =
            fullHeight -
            strokeWidth * 2 -
            spotDiameter -
            margin.top -
            margin.bottom

        svg.style.transform = `translate(${margin.left}px, ${margin.top}px)`
        const svgWidth =
            fullHeight - spotDiameter * 2 - margin.right - margin.left

        const max = Math.max(...values)

        const lastItemIndex = values.length - 1

        const offset = svgWidth / lastItemIndex

        const pathY = getY(max, svgHeight, strokeWidth, values[0])
        let pathCoords = `M${spotDiameter} ${pathY}`

        values.forEach((value: number, index: number) => {
            const x = index * offset + spotDiameter
            const y = getY(max, svgHeight, strokeWidth, value)

            pathCoords += ` L ${x} ${y}`
        })

        const path = buildElement("path", {
            className: "sparkline--line",
            d: pathCoords,
            fill: "none",
            stroke: "blue",
        })
        svg.appendChild(path)

        if (fill?.trim()) {
            const fillCoords = `${pathCoords} V ${fullHeight} L ${spotDiameter} ${fullHeight} Z`

            const fillSection = buildElement("path", {
                className: "sparkline--fill",
                d: fillCoords,
                stroke: "none",
                fill,
            })

            svg.appendChild(fillSection)
        }

        if (!interactive) return
    }

    useEffect(() => {
        sparkLine()
    }, [fullWidth, fullHeight, JSON.stringify(data)])

    return <svg id={id} width={fullWidth} height={fullHeight} ref={svgRef} />
}

Chart.defaultProps = defaultProps

export default Chart
