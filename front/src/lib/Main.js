import React, { useState, useEffect, useRef, Profiler } from 'react';
import ParallelCoord from './ParallelCoord'
import { prepareData, forScatter, emptyClusterScatter, unclusteredScatter, clusteredScatter, indexToData, getXandYScales } from './prepareData'
import { onRenderProfilerHandler } from './measurement'
import Scatter from './Scatter';
import { useLocation } from 'react-router-dom';

function Main(props) {

  const [data, setData] = useState(null)
  const clusterData = useRef(null)
  const scatterData = useRef(null)
  const unclusteredScatterData = useRef(null)
  const clusteredScatterData = useRef(null)
  const scatterDimensions = useRef([0, 1])
  const dimensions = useRef(null)
  const scales = useRef(null)
  const profileSaver = useRef([])
  const qty_of_points = useRef(0)
  const dataForms = ['raw_data', 'cluster']
  var pathname = useLocation().pathname


  useEffect(() => {
    pathname = pathname == '/' ? '/default' : pathname
    setInterval(() => {
      fetch('/dataBroker' + pathname)
        .then(res => res.json())
        .then(resData => {

          if (typeof resData == 'string' && resData.includes('error') && resData.includes('ResourceNotFound')) {
            throw new Error('ResourceNotFound')
          }

          var parsedData = JSON.parse(JSON.parse(resData))

          if (qty_of_points.current != parsedData.raw_data.length){
            profileSaver.current = []
          }

          qty_of_points.current = parsedData.raw_data.length

          dimensions.current = parsedData.dimensions

          var previousClusters = clusterData.current == null ? [] : clusterData.current
          clusterData.current = push10(previousClusters, parsedData)

          parsedData.cluster = indexToData(parsedData.cluster, parsedData.raw_data)
          var preparedParsedData = prepareData(dimensions.current, parsedData)
          setData(preparedParsedData)

          var forScatterData = JSON.parse(JSON.parse(resData))
          scatterData.current = forScatter(scatterDimensions.current, forScatterData, scatterData.current)
          unclusteredScatterData.current = unclusteredScatter(scatterDimensions.current, forScatterData)
          clusteredScatterData.current = clusteredScatter(scatterDimensions.current, forScatterData)

          scales.current = getXandYScales(unclusteredScatterData.current, scatterDimensions.current)
        })
    }, 500)
  }, [])

  const push10 = (arr, parsedData) => {
    var clusterElements = parsedData.cluster.map(clusterIndex => parsedData.raw_data[clusterIndex])
    if (arr.length >= 10) {
      arr.shift()
      arr.push(clusterElements)
    } else {
      arr.push(clusterElements)
    }
    return arr
  }

  if (data == null || scatterData.current == null || scales.current == null) {
    return null
  } else {
    return (
      <Profiler id="overall"
        onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
          profileSaver.current.push(onRenderProfilerHandler(qty_of_points.current, id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver.current))
        }
        }>
        <div className="App">
          <div className="category-graph">
            <Profiler id="scatterWithClusters"
              onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
                profileSaver.current.push(onRenderProfilerHandler(qty_of_points.current, id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver.current))
              }
              }>
              <Scatter
                data={[unclusteredScatterData.current, scatterData.current]}
                nodeSize={d => d.normalizedRadius != undefined ? d.normalizedRadius * 40 : 9}
                dimNames={scatterDimensions.current.map(dim => dimensions.current[dim])}
                scales={scales.current}
              />
            </Profiler>
          </div>
          <div className="category-graph">
            <Profiler id="scatterWithRaw"
              onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
                profileSaver.current.push(onRenderProfilerHandler(qty_of_points.current, id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver.current))
              }
              }>
              <Scatter
                data={clusteredScatterData.current}
                dimNames={scatterDimensions.current.map(dim => dimensions.current[dim])}
                scales={scales.current}
              />
            </Profiler>
          </div>

          <div className="choose-dim">
            {
              ["First Dimension", "Second Dimension"].map((dim, index) => {
                return <div>
                  <span>{dim}</span>
                  <select defaultValue={dimensions.current[index]} onChange={event => {
                    var newScatterDims = index === 0
                      ? [dimensions.current.indexOf(event.target.value), scatterDimensions.current[1]]
                      : [scatterDimensions.current[0], dimensions.current.indexOf(event.target.value)]
                    scatterDimensions.current = newScatterDims
                    scatterData.current = emptyClusterScatter()
                  }}>
                    {dimensions.current.map(category => {
                      return <option value={category} > {category} </option>
                    })}
                  </select>
                </div>

              })
            }
          </div>

          {dataForms.map(form => {
            return (
              <div className="parallel-graphs">
                <Profiler id={'parallel_' + form}
                  onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
                    profileSaver.current.push(onRenderProfilerHandler(qty_of_points.current, id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver.current))
                  }
                  }>
                  <ParallelCoord data={data[form]} />
                </Profiler>
              </div>
            )
          })}

        </div>
      </Profiler>
    );
  }

}

export default Main