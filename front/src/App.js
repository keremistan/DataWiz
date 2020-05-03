import React, { useState, useEffect } from 'react';
import './App.css';
import ParallelCoord from './lib/ParallelCoord'
import { prepareData, forLine } from './lib/prepareData'
import MyResponsiveLine from './lib/Line';


function App() {

  const [data, setData] = useState(null)
  const [lineData, setLineData] = useState(null)
  const categories = ["cpu", "traffic", "ram", "io", "energy"]
  const dataForms = ['raw_data', 'clusters']

  useEffect(() => {
    setInterval(() => {
      fetch('/dataBroker')
        .then(res => res.json())
        .then(data => {
          var parsedData = JSON.parse(JSON.parse(data))
          setData(prepareData(categories, parsedData))
          setLineData(forLine(categories, parsedData))
        })
    }, 500)
  }, [])


  if (data == null || lineData == null) {
    return null
  } else {
    console.log('for line data: ', lineData);
    console.log('for parallel data: ', data);
    
    return (
      <div className="App">
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
