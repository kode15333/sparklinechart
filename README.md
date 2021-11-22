# react-svg-spark-line


## Installation

    $ npm install react-svg-spark-line
    $ yarn add react-svg-spark-line
    
## Demo
[Code Sand Box](https://codesandbox.io/s/red-paper-mrx8v?file=/src/App.tsx)

## Examples

```jsx
import { SparkChart } from "react-svg-spark-line";


const App = () => {

  const data = [
    { name: "Ethereum", date: "2017-01-01", value: 8.3 },
    { name: "Ethereum", date: "2017-02-01", value: 10.57 },
    { name: "Ethereum", date: "2017-03-01", value: 15.73 },
    { name: "Ethereum", date: "2017-04-01", value: 49.51 },
    { name: "Ethereum", date: "2017-05-01", value: 85.69 },
    { name: "Ethereum", date: "2017-06-01", value: 226.51 },
    { name: "Ethereum", date: "2017-07-01", value: 246.65 },
    { name: "Ethereum", date: "2017-08-01", value: 213.87 },
    { name: "Ethereum", date: "2017-09-01", value: 386.61 },
    { name: "Ethereum", date: "2017-10-01", value: 303.56 },
    { name: "Ethereum", date: "2017-11-01", value: 298.21 },
  ]

  const data2 = [394,395,273,1,483,40,2484]

  return (
    < >
      <SparkChart
        id={"chart"}
        data={data2}
        width={400}
        height={400}
        margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        strokeWidth={2}
        spotRadius={2}
        fill={"rgba(244,255,255, 1)"}
        interactive={true}
      />
    </>
  )
}

export default App


```
