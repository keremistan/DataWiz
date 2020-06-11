import React, { useState, useEffect, useRef } from 'react';
import Scatter from './Scatter';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { useInterval } from './prepareData';
import { setScales } from '../redux/actions/scatters'
import Dimensions from './Dimensions';
import ControlPanel from './ControlPanel';

function Cluster(props) {
    const [data, setData] = useState(null)
    const clusterData = useRef([])
    var pathname = useLocation().pathname
    var splittenPathname = pathname.split('/')
    if (splittenPathname[1] == 'clusters') {
        pathname = '/' + splittenPathname[2]
    }
    pathname = pathname == '/' ? '/default' : pathname

    useInterval(() => {
        fetch('/clusterBroker' + pathname)
            .then(res => res.json())
            .then(resData => {
                if (typeof resData == 'string' && resData.includes('error') && resData.includes('ResourceNotFound')) {
                    throw new Error('ResourceNotFound')
                }
                var parsedData = JSON.parse(JSON.parse(resData))
                var extractedData = parsedData['clusters'].map(cluster => ({
                    x: cluster.centroid[0],
                    y: cluster.centroid[1],
                    radius: cluster.radius
                }))

                clusterData.current = [{
                    'id': 'Clusters',
                    'data': extractedData
                }]
                setData(data => data + 1)
                debugger
                props.setScales(
                    {
                        'xScaleMin': -200,
                        'xScaleMax': 200,
                        'yScaleMin': -200,
                        'yScaleMax': 200,
                    }
                )
            })
    }, 500)


    if (clusterData.current == null || data == null || props.scales == null) {
        return null
    } else {
        return (
            <div>
                <ControlPanel />
                <div className="category-graph">
                    <Scatter
                        data={clusterData.current}
                        nodeSize={d => d.radius}
                        dimNames={props.chosenDimensions.map(dim => props.allDimensions[dim])}
                        scales={props.scales}
                    />

                </div>
                <Dimensions />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { dimensions, scatters } = state
    return {
        allDimensions: dimensions.allDimensions,
        chosenDimensions: dimensions.chosenDimensions,
        scales: scatters.scales,
    }
}


const mapDispatchToProps = dispatch => bindActionCreators({
    setScales: setScales,
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Cluster)