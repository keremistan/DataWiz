import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ParallelCoord from './lib/ParallelCoord'
import { prepareData, forLine, forScatter } from './lib/prepareData'
import MyResponsiveLine from './lib/Line';
import Scatter from './lib/Scatter';


function App() {

  const [data, setData] = useState(null)
  const [lineData, setLineData] = useState(null)
  const [scatterData, setScatterData] = useState(null)
  // const [scatterDimensions, setScatterDimensions] = useState([0, 1])
  const scatterDimensions = useRef([0, 1])
  const categories = ["cpu", "traffic", "ram", "io", "energy"]
  const dataForms = ['raw_data', 'clusters']

  useEffect(() => {
    setInterval(() => {
      fetch('/dataBroker')
        .then(res => res.json())
        .then(data => {
          var parsedData = JSON.parse(JSON.parse(data))
          setData(prepareData(categories, parsedData))
          setLineData(forLine(categories, { raw_data: parsedData.raw_data, clusters: parsedData.clusters }))
          var forScatterData = JSON.parse(JSON.parse(data))
          // setScatterData(forScatter(scatterDimensions, forScatterData.clusters, forScatterData.weights))
          setScatterData(forScatter(scatterDimensions.current, forScatterData.clusters, forScatterData.weights))
        })
    }, 500)
  }, [])


  if (data == null || lineData == null || scatterData == null) {
    return null
  } else {
    return (
      <div className="App">
        <div className="category-graph">
          <Scatter data={[scatterData]} nodeSize={d => 10 * d.radius} dimNames={scatterDimensions.current.map(dim => categories[dim])} />
          <div className="choose-dim">
            {
              ["First Dimension", "Second Dimension"].map((dim, index) => {
                return <div>
                  <span>{dim}</span>
                  <select defaultValue={categories[index]} onChange={event => {
                    // debugger
                    var newScatterDims = index === 0 
                    ? [categories.indexOf(event.target.value), scatterDimensions.current[1]]
                    : [scatterDimensions.current[0], categories.indexOf(event.target.value)]
                    console.log('new scatter dimensions: ', newScatterDims)
                    console.log('previous scatter dimensions: ', scatterDimensions.current)
                    // setScatterDimensions(newScatterDims)
                    scatterDimensions.current = newScatterDims
                  }}>
                    {categories.map(category => {
                      return <option value={category} > {category} </option>
                    })}
                  </select>
                </div>

              })
            }
          </div>
        </div>

        <div className="parallel-graphs">
          <ParallelCoord data={data.raw_data} />
          <ParallelCoord data={data.clusters} />
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
