import React, { useState, useEffect, useRef } from 'react';
import Scatter from './Scatter';
import { useLocation } from 'react-router-dom';

function Cluster(props) {
    const [data, setData] = useState(null)
    const clusterData = useRef([])
    var pathname = useLocation().pathname

    useEffect(() => {
        var splittenPathname = pathname.split('/')
        if (splittenPathname[1] == 'clusters') {
            pathname = '/' + splittenPathname[2]
        }
        pathname = pathname == '/' ? '/default' : pathname
        const intervalId = setInterval(() => {
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
                })
        }, 500)
        return () => clearInterval(intervalId)
    }, [])


    if (clusterData.current == null || data == null) {
        return null
    } else {
        return (
            <div>
                <div className="category-graph">
                    <Scatter
                        data={clusterData.current}
                        nodeSize={d => d.radius}
                        dimNames={['Hansel', 'Gratel']}
                        scales={{
                            'xScaleMin': -100,
                            'xScaleMax': 100,
                            'yScaleMin': -100,
                            'yScaleMax': 100,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Cluster