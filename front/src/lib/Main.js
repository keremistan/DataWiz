import React, { useState, useEffect, useRef } from 'react';
import ParallelCoord from './ParallelCoord'
import { prepareData, forScatter, unclusteredScatter, clusteredScatter, indexToData, getXandYScales, useInterval, retainedClusters } from './prepareData'
import Scatter from './Scatter';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setDimensions } from '../redux/actions/dimensions'
import { updateClusters, updateNumOfRetainedClusters } from '../redux/clusters/actions'
import { setClustersOnRaw, setUnclusteredRaw, setClusteredRaw, setScales } from '../redux/actions/scatters'
import ControlPanel from './ControlPanel';
import Dimensions from './Dimensions';


function Main(props) {

  const [data, setData] = useState(null)
  const dataForms = ['raw_data', 'cluster']
  var pathname = useLocation().pathname
  var history = useHistory()

  useInterval(() => {
    pathname = pathname == '/' ? '/default' : pathname
    fetch('/dataBroker' + pathname)
      .then(res => {
        if (res.status == 500) {
          throw new Error(res.status)
        } else {
          return res.json()
        }
      })
      .then(async resData => {
        if (resData == null) {
          history.push("/dataAbsent")
          return
        } else if (typeof resData == 'string' && resData.includes('error') && resData.includes('ResourceNotFound')) {
          history.push("/resourceNotFound")
          return
        }

        var parsedData = JSON.parse(JSON.parse(resData))
        props.setDimensions(parsedData.dimensions)
        updateClusters(retainedClusters(props.clustersWithRawData, parsedData, props.numOfRetainedClusters))
        parsedData.cluster = indexToData(parsedData.cluster, parsedData.raw_data)
        var preparedParsedData = prepareData(props.allDimensions, parsedData)
        setData(preparedParsedData)

        var forScatterData = JSON.parse(JSON.parse(resData))
        props.setClustersOnRaw(forScatter(props.chosenDimensions, forScatterData, props.clustersOnRaw, props.numOfRetainedClusters.value))
        var unclusteredScatterData = unclusteredScatter(props.chosenDimensions, forScatterData)
        props.setUnclusteredRaw(unclusteredScatterData)
        props.setClusteredRaw(clusteredScatter(props.chosenDimensions, forScatterData))
        props.setScales(getXandYScales(unclusteredScatterData, props.chosenDimensions))
      }).catch(err => {
        if (err.message === "500") {
          history.push("/serverDown")
        }
      })
  }, 500)


  if (data == null || props.clustersOnRaw == null || props.unclusteredRaw == null || props.scales == null || props.allDimensions == []) {
    return null
  } else {
    return (
      <div>
        <ControlPanel />
        <div className="category-graph">
          <Scatter
            data={[props.unclusteredRaw, props.clustersOnRaw]}
            nodeSize={d => d.normalizedRadius != undefined ? d.normalizedRadius * 40 : 9}
            dimNames={props.chosenDimensions.map(dim => props.allDimensions[dim])}
            scales={props.scales}
          />
        </div>
        <div className="category-graph">
          <Scatter
            data={props.clusteredRaw}
            dimNames={props.chosenDimensions.map(dim => props.allDimensions[dim])}
            scales={props.scales}
          />
        </div>
        <Dimensions />
        {dataForms.map(form => {
          return (
            <div className="parallel-graphs">
              <ParallelCoord data={data[form]} variables={props.allDimensions.map(dim => ({
                'key': dim,
                'type': 'linear',
                'legend': dim,
                'ticksPosition': 'before',
                'legendPosition': 'start',
                'legendOffset': 20
              }))} />
            </div>
          )
        })}

      </div>
    );
  }

}


const mapStateToProps = state => {
  const { dimensions, clusters, scatters } = state
  return {
    allDimensions: dimensions.allDimensions,
    chosenDimensions: dimensions.chosenDimensions,
    clustersWithRawData: clusters.clustersWithRawData,
    clustersOnRaw: scatters.clustersOnRaw,
    unclusteredRaw: scatters.unclusteredRaw,
    clusteredRaw: scatters.clusteredRaw,
    scales: scatters.scales,
    numOfRetainedClusters: clusters.numOfRetainedClusters,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setDimensions: setDimensions,
  updateClusters: updateClusters,
  setClustersOnRaw: setClustersOnRaw,
  setUnclusteredRaw: setUnclusteredRaw,
  setClusteredRaw: setClusteredRaw,
  setScales: setScales,
  updateNumOfRetainedClusters: updateNumOfRetainedClusters,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)