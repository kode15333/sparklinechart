import React, { RefObject, useEffect, useRef } from "react"
import { DataType, Margin } from "./types"
import { buildElement, getY } from "./util"
import { useWindowSize } from "../useWindowSize"
import { EventMap } from "../../lib/types"

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
    cursorWidth,
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

        const svgWidth =
            fullHeight - spotDiameter * 2 - margin.right - margin.left

        svg.style.transform = `translate(${margin.left}px, ${margin.top}px)`

        const max = Math.max(...values)

        const lastItemIndex = values.length - 1

        const offset = svgWidth / lastItemIndex

        const dataPoints: ((number | DataType) & {
            index: number
            x: number
            y: number
        })[] = []
        const pathY = getY(max, svgHeight, strokeWidth, values[0])
        let pathCoords = `M${spotDiameter} ${pathY}`

        values.forEach((value: number, index: number) => {
            const x = index * offset + spotDiameter
            const y = getY(max, svgHeight, strokeWidth, value)

            pathCoords += ` L ${x} ${y}`

            dataPoints.push(
                Object.assign({}, data[index], {
                    index: index,
                    x: x,
                    y: y,
                })
            )
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

        const offscreen = -1000

        const cursor = buildElement("line", {
            className: "sparkline--cursor",
            x1: `${offscreen}`,
            x2: `${offscreen}`,
            y1: `${offscreen}`,
            y2: `${fullHeight}`,
            strokeWidth: `${cursorWidth}`,
        })

        const spot = buildElement("circle", {
            className: "sparkline--spot",
            cx: `${offscreen}`,
            cy: `${offscreen}`,
            r: `${spotRadius}`,
        })

        svg.appendChild(cursor)
        svg.appendChild(spot)

        const interactionLayer = buildElement("rect", {
            className: "sparkline--interaction-layer",
            width: `${width}`,
            height: `${height}`,
            style: "fill: transparent; stroke: transparent; pointer-events: all;",
        })
        svg.appendChild(interactionLayer)

        const add = <Event extends keyof EventMap<SVGSVGElement>>(
            name: Event,
            callback: (event: EventMap<HTMLCanvasElement>[Event]) => void
        ) => {
            interactionLayer.addEventListener(name, callback)

            return () => {
                interactionLayer.removeEventListener(name, callback)
            }
        }

        const drawStart = () => {
            console.log("drawStart")
        }

        const draw = (position: { x: number; y: number }) => {
            let nextDataPoint = dataPoints.find((entry) => {
                return entry.x >= position.x
            })

            if (!nextDataPoint) {
                nextDataPoint = dataPoints[lastItemIndex]
            }

            const previousDataPoint =
                dataPoints[dataPoints.indexOf(nextDataPoint) - 1]
            let currentDataPoint
            let halfway

            if (previousDataPoint) {
                halfway =
                    previousDataPoint.x +
                    (nextDataPoint.x - previousDataPoint.x) / 2
                currentDataPoint =
                    position.x >= halfway ? nextDataPoint : previousDataPoint
            } else {
                currentDataPoint = nextDataPoint
            }

            const xChord = "" + currentDataPoint.x
            const yChord = "" + currentDataPoint.y

            spot.setAttribute("cx", xChord)
            spot.setAttribute("cy", yChord)

            cursor.setAttribute("x1", xChord)
            cursor.setAttribute("x2", yChord)
        }

        const drawEnd = () => {
            console.log("drawEnd")
        }

        const handleMouseMove = (e: MouseEvent) => {
            const position = {
                x: e.offsetX,
                y: e.offsetY,
            }
            draw(position)
        }

        const handleTouchMove = (e: TouchEvent) => {
            const rect = svg.getBoundingClientRect()
            const position = {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            }
            draw(position)
        }

        const addDrawEvent = () => {
            const events = [
                add("mousedown", drawStart),
                add("mousemove", handleMouseMove),
                add("mouseup", drawEnd),
                add("mouseleave", drawEnd),
                add("touchstart", drawStart),
                add("touchmove", handleTouchMove),
                add("touchend", drawEnd),
            ]

            // removeDrawEvent = () => canvasEvents.forEach((off) => off!())
        }

        addDrawEvent()
    }

    useEffect(() => {
        sparkLine()
    }, [fullWidth, fullHeight, JSON.stringify(data)])

    return <svg id={id} width={fullWidth} height={fullHeight} ref={svgRef} />
}

Chart.defaultProps = defaultProps

export default Chart
