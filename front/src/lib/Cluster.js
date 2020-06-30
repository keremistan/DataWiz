import React, { useState, useEffect, useRef } from 'react';
import Scatter from './Scatter';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { useInterval, increase_brightness } from './prepareData';
import { setScales } from '../redux/actions/scatters'
import { setDimensions } from '../redux/actions/dimensions'
import ControlPanel from './ControlPanel';

function Cluster(props) {
    const [clusterData, setClusterData] = useState([])
    const [retainedClusters, setRetainedClusters] = useState([])
    const [colors, setColors] = useState([])

    var pathname = useLocation().pathname
    var history = useHistory()

    var splittenPathname = pathname.split('/clusters')
    if (splittenPathname[1] == '' && splittenPathname.length == 2) {
        pathname = '/'
    } else {
        pathname = splittenPathname[1]
    }
    pathname = pathname == '/' ? '/default' : pathname

    useInterval(() => {
        fetch('/clusterBroker' + pathname)
            .then(res => {
                if (res.status == 500) {
                    throw new Error(res.status)
                } else {
                    return res.json()
                }
            })
            .then(resData => {
                debugger
                if (typeof resData == 'string' && resData.includes('error') && resData.includes('ResourceNotFound')) {
                    history.push("/resourceNotFound")
                    return
                }
                var parsedData = JSON.parse(JSON.parse(resData))
                var extractedData = parsedData['clusters'].map(cluster => ({
                    x: cluster.centroid[0],
                    y: cluster.centroid[1],
                    radius: cluster.radius
                }))

                setClusterData([{
                    'id': 'Clusters',
                    'data': extractedData
                }])
                extractAndSetScales(extractedData)
                retainBiggestClustersSeperately(extractedData)

                if (parsedData.dimensions) {
                    props.setDimensions(parsedData.dimensions)
                } else {
                    props.setDimensions(['First Dimension', 'Second Dimension'])
                }

                var tempColors = []
                for (var i = 0; i < retainedClusters.length; i++) {
                    var percent = 100 * ((retainedClusters.length - i) / (retainedClusters.length * 2) + 0.5)
                    percent = percent == 100 ? 1 : 100 - percent
                    tempColors.push(increase_brightness('#C9202C', percent))
                }
                tempColors.reverse()
                setColors(tempColors)
            }).catch(err => {
                if (err.message === "500") {
                    history.push("/serverDown")
                }
            })
    }, 500)

    const retainBiggestClustersSeperately = clusterElements => {
        var tempRetainedCluster = [...retainedClusters]
        var biggestEl = [...clusterElements.sort((a, b) => a.radius - b.radius)].pop()

        if (tempRetainedCluster.some(item => biggestEl.x == item.data[0].x && biggestEl.y == item.data[0].y && biggestEl.radius == item.data[0].radius)) { // The same already exists ?
            return
        }

        if (props.numOfRetainedClusters.value < tempRetainedCluster.length) { // are there more clusters than should be ?
            tempRetainedCluster = []
        }

        if (tempRetainedCluster.length >= props.numOfRetainedClusters.value) {
            tempRetainedCluster.shift()
            tempRetainedCluster.push({
                'id': 'cluster_' + Math.random().toString(),
                'data': [biggestEl]
            })

        } else {
            tempRetainedCluster.push({
                'id': 'cluster_' + Math.random().toString(),
                'data': [biggestEl]
            })
        }

        tempRetainedCluster.forEach((cluster, index) => cluster.id = index.toString() + '. Cluster')
        setRetainedClusters(tempRetainedCluster)
    }

    const extractAndSetScales = extractedData => {

        const ascOrder = (a, b) => a - b
        var xVals = extractedData.map(item => item.x).sort(ascOrder)
        var yVals = extractedData.map(item => item.y).sort(ascOrder)

        if (props.scales) {
            props.setScales({
                'xScaleMin': Math.min(xVals[0], props.scales.xScaleMin),
                'xScaleMax': Math.max(xVals[xVals.length - 1], props.scales.xScaleMax),
                'yScaleMin': Math.min(yVals[0], props.scales.yScaleMin),
                'yScaleMax': Math.max(yVals[yVals.length - 1], props.scales.yScaleMax),
            })
        } else {
            props.setScales({
                'xScaleMin': xVals[0],
                'xScaleMax': xVals[xVals.length - 1],
                'yScaleMin': yVals[0],
                'yScaleMax': yVals[yVals.length - 1],
            })
        }
    }

    if (clusterData == [] || props.scales == null) {
        return null
    } else {
        return (
            <div>
                <ControlPanel />
                <div className="category-graph">
                    <Scatter
                        data={retainedClusters}
                        nodeSize={d => d.radius}
                        scales={props.scales}
                        dimNames={props.dimensions}
                        colors={colors}
                    />
                </div>
                <div className="category-graph">
                    <Scatter
                        data={clusterData}
                        nodeSize={d => d.radius}
                        scales={props.scales}
                        dimNames={props.dimensions}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { scatters, clusters, dimensions } = state
    return {
        scales: scatters.scales,
        numOfRetainedClusters: clusters.numOfRetainedClusters,
        dimensions: dimensions.allDimensions
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setScales: setScales,
    setDimensions: setDimensions,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Cluster)