import React, { RefObject, useEffect, useRef } from "react"
import { buildElement, getY } from "./util"
import { ChartData, EventMap, Margin, Position } from "./types";

const OFF_SCREEN = "-1000"

type Props<T> = {
    /** id */
    id: string
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

function Chart<T>({
    id,
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
}: Props<T> & typeof defaultProps) {
    const svgRef = useRef<SVGSVGElement>(null)

    const fullHeight = height || 0;
    const fullWidth = width || 0;

    const sparkLine = () => {
        const svg = svgRef.current as SVGSVGElement
        if (!data.length || !svg) return
        svg.innerHTML = ""

        const values = data.map((v) => {
            if (typeof v === "number") return v

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
            fullWidth - spotDiameter * 2 - margin.right - margin.left

        svg.style.transform = `translate(${margin.left}px, ${margin.top}px)`

        const max = Math.max(...values)

        const lastItemIndex = values.length - 1

        const offset = svgWidth / lastItemIndex

        const dataPoints: Position[] = []

        const pathY = getY(max, svgHeight, strokeWidth, values[0])

        let pathCoords = `M${spotDiameter} ${pathY}`

        values.forEach((value: number, index: number) => {
            const x = index * offset + spotDiameter
            const y = getY(max, svgHeight, strokeWidth, value)

            pathCoords += ` L ${x} ${y}`

            dataPoints.push({ x, y })
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

        const cursor = buildElement("line", {
            className: "sparkline--cursor",
            x1: OFF_SCREEN,
            x2: OFF_SCREEN,
            y1: "0",
            y2: `${fullHeight}`,
            strokeWidth: `${cursorWidth}`,
            stroke: cursorColor,
        })

        const spot = buildElement("circle", {
            className: "sparkline--spot",
            cx: OFF_SCREEN,
            cy: OFF_SCREEN,
            r: `${spotRadius}`,
        })

        const interactionLayer = buildElement("rect", {
            className: "sparkline--interaction-layer",
            width: `${width}`,
            height: `${height}`,
            style: "fill: transparent; stroke: transparent; pointer-events: all;",
        })

        svg.appendChild(cursor)
        svg.appendChild(spot)
        svg.appendChild(interactionLayer)

        const add = <Event extends keyof EventMap<SVGSVGElement>>(
            name: Event,
            callback: (event: EventMap<HTMLCanvasElement>[Event]) => void,
            options?: boolean | AddEventListenerOptions
        ) => {
            interactionLayer.addEventListener(name, callback, options)

            return () => {
                interactionLayer.removeEventListener(name, callback)
            }
        }

        const drawStart = () => {
            if (onDrawStart) onDrawStart()
        }

        const draw = (position: Position) => {
            let nextDataPoint = dataPoints.find(
                (entry) => entry.x >= position.x
            )

            if (!nextDataPoint) {
                nextDataPoint = dataPoints[lastItemIndex]
            }

            const previousDataPoint =
                dataPoints[dataPoints.indexOf(nextDataPoint) - 1]
            let currentDataPoint

            if (previousDataPoint) {
                const halfway =
                    previousDataPoint.x +
                    (nextDataPoint.x - previousDataPoint.x) / 2
                currentDataPoint =
                    position.x >= halfway ? nextDataPoint : previousDataPoint
            } else {
                currentDataPoint = nextDataPoint
            }

            const xChord = currentDataPoint.x
            const yChord = currentDataPoint.y

            spot.setAttribute("cx", `${xChord}`)
            spot.setAttribute("cy", `${yChord}`)

            cursor.setAttribute("x1", `${xChord}`)
            cursor.setAttribute("x2", `${xChord}`)
            if (onDraw) onDraw()
        }

        const drawEnd = () => {
            cursor.setAttribute("x1", OFF_SCREEN)
            cursor.setAttribute("x2", OFF_SCREEN)

            spot.setAttribute("cx", OFF_SCREEN)
            if (onDrawEnd) onDrawEnd()
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
            add("mousedown", drawStart)
            add("mousemove", handleMouseMove)
            add("mouseup", drawEnd)
            add("mouseleave", drawEnd)
            add("touchstart", drawStart, { capture: false, passive: true })
            add("touchmove", handleTouchMove, { capture: false, passive: true })
            add("touchend", drawEnd)
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
