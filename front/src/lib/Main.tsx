import React, { useState } from 'react';
import ParallelCoord from './ParallelCoord'
import { forScatter, unclusteredScatter, clusteredScatter, indexToData, getXandYScales, useInterval, retainedClusters, prepareData } from './prepareData'
import Scatter from './Scatter';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux'
import { setDimensions } from '../redux/dimensions/dimensionsActions'
import { updateClusters, updateNumOfRetainedClusters } from '../redux/clusters/clustersActions'
import { setClustersOnRaw, setUnclusteredRaw, setClusteredRaw, setScales } from '../redux/scatters/scattersActions'
import ControlPanel from './ControlPanel';
import Dimensions from './Dimensions';
import { allDimensionsType, chosenDimensionsType, dimensionsVariableType, setDimensionsType } from '../redux/dimensions/dimensionsTypes';
import { numOfRetainedClustersType } from '../redux/clusters/clusterTypes';
import { scales } from '../redux/scatters/scattersTypes';

type stateProps = {
  allDimensions: allDimensionsType,
  chosenDimensions: chosenDimensionsType,
  clustersWithRawData: any,
  clustersOnRaw: any,
  unclusteredRaw: any,
  clusteredRaw: any
  scales: scales,
  numOfRetainedClusters: numOfRetainedClustersType,
}

type Props = stateProps & {
  setDimensions: setDimensionsType,
  setClustersOnRaw: any,
  setUnclusteredRaw: any,
  setClusteredRaw: any,
  setScales: typeof setScales,
}

type sphereType = {
  x: number,
  y: number,
  radius: number,
  normalizedRadius: number
}

type categorizedData = {
  [key: string]: Array<object>
}

function Main(props: Props) {
  const [data, setData] = useState<categorizedData | null>(null)
  const dataForms = ['raw_data', 'cluster']
  var pathname = useLocation().pathname
  var history = useHistory()

  useInterval(() => {
    pathname = pathname === '/' ? '/default' : pathname
    fetch('/dataBroker' + pathname)
      .then(res => {
        if (res.status === 500) {
          throw new Error(res.status.toString())
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
        let currentDataDimensions: string[] = props.allDimensions.length === 0 ? parsedData.dimensions : props.allDimensions
        var preparedParsedData = prepareData(currentDataDimensions, parsedData)

        setData(preparedParsedData)

        var forScatterData = JSON.parse(JSON.parse(resData))
        props.setClustersOnRaw(forScatter(props.chosenDimensions, forScatterData, props.clustersOnRaw, props.numOfRetainedClusters.value))
        var unclusteredScatterData = unclusteredScatter(props.chosenDimensions, forScatterData)
        props.setUnclusteredRaw(unclusteredScatterData)
        props.setClusteredRaw(clusteredScatter(props.chosenDimensions, forScatterData))
        let currentScales: scales = getXandYScales(unclusteredScatterData, props.chosenDimensions)
        props.setScales(currentScales)
      }).catch(err => {
        if (err.message === "500") {
          history.push("/serverDown")
        }
      })
  }, 500)


  if (data == null || props.clustersOnRaw == null || props.unclusteredRaw == null || props.scales == null || props.allDimensions === []) {
    return null
  } else {
    return (
      <div>
        <ControlPanel />
        <div className="category-graph">
          <Scatter
            data={[props.unclusteredRaw, props.clustersOnRaw]}
            nodeSize={(d: sphereType) => d.normalizedRadius !== undefined ? d.normalizedRadius * 40 : 9}
            dimNames={props.chosenDimensions.map(dim => props.allDimensions[dim])}
            scales={props.scales}
            colors={null}
          />
        </div>
        <div className="category-graph">
          <Scatter
            data={props.clusteredRaw}
            dimNames={props.chosenDimensions.map(dim => props.allDimensions[dim])}
            scales={props.scales}
            colors={null}
            nodeSize={null}
          />
        </div>
        <Dimensions />
        {dataForms.map(form => {
          return (
            <div className="parallel-graphs">
              {/* <ParallelCoord data={data[form]} variables={props.allDimensions.map(dim => ({ */}
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


const mapStateToProps = (state: { dimensions: dimensionsVariableType, clusters: any, scatters: any }) => {
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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => bindActionCreators({
  setDimensions: setDimensions,
  updateClusters: updateClusters,
  setClustersOnRaw: setClustersOnRaw,
  setUnclusteredRaw: setUnclusteredRaw,
  setClusteredRaw: setClusteredRaw,
  setScales: setScales,
  updateNumOfRetainedClusters: updateNumOfRetainedClusters,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main)