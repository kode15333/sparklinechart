import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import * as d3 from "d3"
import { useWindowSize } from "./useWindowSize"
import Chart from "./Chart"

type DataType = {
    value: number
    date: Date
}
const LineChart = () => {
    const divRef = useRef<HTMLDivElement>(null)
    const [width, height] = useWindowSize<HTMLDivElement>(divRef)
    useEffect(() => {
        d3.select("#chart").append("svg")
    }, [])

    const data: DataType[] = [
        { value: 1, date: new Date() },
        { value: 1, date: new Date() },
        { value: 1, date: new Date() },
    ]
    return (
        <Containter id="chart" ref={divRef}>
            <Chart
                data={data}
                width={width}
                height={height}
                margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
                strokeWidth={2}
                spotRadius={2}
            />
        </Containter>
    )
}

export default LineChart

const Containter = styled.div`
    width: 100%;
    height: 100%;
`
