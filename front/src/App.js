import React, { useState, useEffect } from 'react';
import './App.css';
import ParallelCoord from './lib/ParallelCoord'
import { prepareData } from './lib/prepareData'

function App() {

  const [data, setData] = useState(null)
  const categories = ["cpu", "traffic", "ram", "io", "energy"]

  useEffect(() => {
    setInterval(() => {
      fetch('/dataBroker')
        .then(res => res.json())
        .then(data => {
          var parsedData = JSON.parse(JSON.parse(data))
          var preparedData = prepareData(categories, parsedData)
          setData(preparedData)
        })
    }, 500)
  }, [])


  if (data == null) {
    return null
  } else {
    return (
      <div className="App">
        <ParallelCoord data={data.raw_data} />
        <ParallelCoord data={data.clusters} />
      </div>
    );
  }
}

export default App;
