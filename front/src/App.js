import React, { useState, useEffect, useRef, useReducer } from 'react';
import './App.css';
import ParallelCoord from './lib/ParallelCoord'
import { prepareData, forLine, forScatter, emptyClusterScatter, unclusteredScatter } from './lib/prepareData'
import MyResponsiveLine from './lib/Line';
import Scatter from './lib/Scatter';

function App() {

  const [data, setData] = useState(null)
  const clusterData = useRef(null)
  const [lineData, setLineData] = useState(null)
  const scatterData = useRef(null)
  const unclusteredScatterData = useRef(null)
  const scatterDimensions = useRef([0, 1])
  const categories = ["cpu", "traffic", "ram", "io", "energy"]
  const dataForms = ['raw_data', 'cluster']

  useEffect(() => {
    setInterval(() => {
      fetch('/dataBroker')
        .then(res => res.json())
        .then(resData => {
          var parsedData = JSON.parse(JSON.parse(resData))
          var previousClusters = clusterData.current == null ? [] : clusterData.current
          clusterData.current = push20(previousClusters, parsedData)
          parsedData.cluster = clusterData.current.reduce((acc, curr) => acc = [...acc, ...curr], [])
          setData(prepareData(categories, parsedData))
          setLineData(forLine(categories, { raw_data: parsedData.raw_data }))
          var forScatterData = JSON.parse(JSON.parse(resData))
          scatterData.current = forScatter(scatterDimensions.current, forScatterData, scatterData.current)
          unclusteredScatterData.current = unclusteredScatter(scatterDimensions.current, forScatterData)
        })
    }, 500)
  }, [])

  const push20 = (arr, parsedData) => {
    var clusterElements = parsedData.cluster.map(clusterIndex => parsedData.raw_data[clusterIndex])
    if (arr.length >= 10) {
      arr.shift()
      arr.push(clusterElements)
    } else {
      arr.push(clusterElements)
    }
    return arr
  }

  if (data == null || lineData == null || scatterData.current == null) {
    return null
  } else {
    return (
      <div className="App">
        <div className="category-graph">
          <Scatter
            data={[unclusteredScatterData.current, scatterData.current]}
            nodeSize={d => d.radius != undefined ? d.radius * 0.75 : 5}
            dimNames={scatterDimensions.current.map(dim => categories[dim])}
          />
        </div>
        <div className="choose-dim">
          {
            ["First Dimension", "Second Dimension"].map((dim, index) => {
              return <div>
                <span>{dim}</span>
                <select defaultValue={categories[index]} onChange={event => {
                  var newScatterDims = index === 0
                    ? [categories.indexOf(event.target.value), scatterDimensions.current[1]]
                    : [scatterDimensions.current[0], categories.indexOf(event.target.value)]
                  scatterDimensions.current = newScatterDims
                  scatterData.current = emptyClusterScatter()
                }}>
                  {categories.map(category => {
                    return <option value={category} > {category} </option>
                  })}
                </select>
              </div>

            })
          }
        </div>


        <div className="parallel-graphs">
          <ParallelCoord data={data.raw_data} />
          <ParallelCoord data={data.cluster} />
        </div>

        {categories.map(category => {
          return (
            <div className="category-graph">
              <MyResponsiveLine data={lineData[category]} category={category} />
            </div>
          )
        })}

      </div>
    );
  }
}

export default App;
