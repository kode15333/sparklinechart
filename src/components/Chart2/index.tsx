import React, { RefObject, useEffect, useRef } from "react"
import { ChartData, DataType, Margin, Position } from "../Chart/types"
import { useWindowSize } from "../useWindowSize"
import { buildElement, getY } from "../Chart/util"
import { OFF_SCREEN } from "../Chart/constant"
import { EventMap } from "../../types/event/types"
import * as d3 from "d3"
type Props = {
    /** id */
    id: string
    /** containerRef */
    containerRef: RefObject<HTMLElement>
    /** data*/
    data: number[] | DataType[]
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
    /** onDrawStart */
    onDrawStart?: () => void
    /** onDraw */
    onDraw?: () => void
    /** onDrawEnd */
    onDrawEnd?: () => void
}

const defaultProps = {
    strokeWidth: 2,
    spotRadius: 2,
    cursorWidth: 2,
    cursorColor: "red",
    margin: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
}

function Chart2({
    id,
    containerRef,
    data,
    height,
    width,
    margin,
    strokeWidth,
    spotRadius,
    cursorWidth,
    cursorColor,
    fill,
    interactive,
    onDrawStart,
    onDraw,
    onDrawEnd,
}: Props & typeof defaultProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [containerWidth, containerHeight] = useWindowSize(containerRef)

    const fullHeight = height || containerHeight
    const fullWidth = width || containerWidth

    const sparkLine = () => {
        const svg = svgRef.current as SVGSVGElement
        if (!data.length || !svg) return
        svg.innerHTML = ""
        d3.select(svg).remove()

        const xData = d3.map([...data], (d) => {
            if (typeof d === "number") return d
            return d.value
        })
        const xMin = d3.min(xData)!
        const xMax = d3.max(xData)!
        console.log(xData, xMin, xMax)

        const xChoords = d3.scaleLinear().domain([xMin, xMax]).range([0, width])
    }

    useEffect(() => {
        sparkLine()
    }, [fullWidth, fullHeight, JSON.stringify(data)])

    return <svg id={id} width={fullWidth} height={fullHeight} ref={svgRef} />
}

Chart2.defaultProps = defaultProps

export default Chart2
