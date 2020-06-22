import React, { useEffect, useRef } from 'react';
import { medianAbsoluteDeviation, variance, mean, standardDeviation } from 'simple-statistics'
// data : {clusters: [], raw: []}
export function prepareData(categories, data) {
    var data = JSON.parse(JSON.stringify(data))

    Object.keys(data).forEach(category => {
        data[category].forEach((dataPoint, index) => {
            var tempDataPoint = {}
            categories.map((dimension, index) => {
                tempDataPoint[dimension] = dataPoint[index]
            })
            data[category][index] = tempDataPoint
            tempDataPoint = {}
        })
    });
    return data
}

// data: {cluster: [], raw: []}
// categories: [...]
// return { 'traffic': [{..},], 'io': [{..},] }
export function forLine(categories, data) {
    var forLineTransformedData = {}
    var counter = 0
    for (const category of categories) {
        forLineTransformedData[category] = getTransformedData(counter, data)
        counter += 1
    }
    return forLineTransformedData
}

function getTransformedData(category, data) {
    var dataInThisCatefory = []
    var dataStates = Object.keys(data)
    for (const state of dataStates) {
        var tempData = []
        var counter = 0
        for (const dataPoint of data[state]) {
            tempData.push({
                "x": counter,
                "y": dataPoint[category]
            })
            counter += 1
        }
        dataInThisCatefory.push({
            "id": state,
            "color": "rgb(0, 0, 0)",
            "data": tempData
        })
    }
    return dataInThisCatefory
}

export function unclusteredScatter(dimensions, data) {
    if (dimensions.length !== 2) throw new Error('not 2 dimensional')
    var first_dim = dimensions[0]
    var second_dim = dimensions[1]
    var scatterData = []
    if (data == null) return []
    var raw_data = data.raw_data
    var firstDimData = raw_data.map(dataPoint => dataPoint[first_dim])
    var secondDimData = raw_data.map(dataPoint => dataPoint[second_dim])

    var dataPoints = []
    firstDimData.map((fdd, index) => {
        dataPoints.push({
            x: fdd,
            y: secondDimData[index]
        })
    })

    return {
        id: 'raw_data',
        data: dataPoints
    }
}

export function clusteredScatter(dimensions, data) {
    if (dimensions.length !== 2) throw new Error('not 2 dimensional')
    var first_dim = dimensions[0]
    var second_dim = dimensions[1]
    var scatterData = []
    if (data == null) return []

    var all_clustered_data = data.all_clusters
    var raw_data = data.raw_data
    var cluster_numbers = Array.from(new Set(all_clustered_data)).sort()

    if (cluster_numbers[0] == -1) {
        cluster_numbers.shift()
        cluster_numbers.push(-1)
    }

    for (const cluster_number of cluster_numbers) {
        let tempPoints = []
        var counter = 0
        for (const cluster_data of all_clustered_data) {
            if (cluster_data == cluster_number) {
                tempPoints.push({
                    x: raw_data[counter][first_dim],
                    y: raw_data[counter][second_dim]
                })
            }
            counter += 1
        }
        counter = 0

        var cluster_name = ''
        if (cluster_number == 0) {
            cluster_name = 'largest_cluster'
        } else if (cluster_number == -1) {
            cluster_name = 'noise'
        } else {
            cluster_name = cluster_number + '. cluster'
        }

        scatterData.push({
            'id': cluster_name,
            'data': tempPoints
        })
    }

    return scatterData
}

export function forScatter(dimensions, data, scatterData, maxNumOfEl = 10) {
    if (dimensions.length !== 2) throw new Error('not 2 dimensional')
    var first_dim = dimensions[0]
    var second_dim = dimensions[1]
    scatterData = scatterData == null
        ? {
            id: 'microclusters',
            data: []
        }
        : scatterData
    var clusterData = data.cluster.map(clusterIndex => data.raw_data[clusterIndex])
    var sphere
    var firstCluster = clusterData.map(cluster => cluster[first_dim])
    var secondCluster = clusterData.map(cluster => cluster[second_dim])
    var N = firstCluster.length
    var L1 = firstCluster.reduce((acc, curr) => acc + curr, 0)
    var L2 = secondCluster.reduce((acc, curr) => acc + curr, 0)
    var S = L1 * L1 + L2 * L2
    let xx = (L1 / N) ** 2
    let yy = (L2 / N) ** 2
    var radiusX = Math.sqrt(S / N - xx)
    var radiusY = Math.sqrt(S / N - yy)
    var radius = parseInt(Math.max(radiusX, radiusY))
    var x = parseInt(L1 / N)
    var y = parseInt(L2 / N)

    var meanRadius = scatterData.data.reduce((acc, dataPoint) => dataPoint.radius + acc, 0) / scatterData.data.length
    scatterData.data.forEach(clusterPoint => clusterPoint.normalizedRadius = clusterPoint.radius / meanRadius)
    var normRadius = radius / (meanRadius || radius)

    sphere = {
        x: x,
        y: y,
        radius: radius,
        normalizedRadius: normRadius
    }

    var strData = scatterData.data.map(d => JSON.stringify(d))
    var strSphere = JSON.stringify(sphere)
    if (strData.indexOf(strSphere) !== -1) return scatterData

    if (scatterData.data.length >= maxNumOfEl) scatterData.data.shift()
    scatterData.data.push(sphere)
    return scatterData
}

export function emptyClusterScatter() {
    return {
        id: 'microclusters',
        data: []
    }
}

// indexes: [], dataArr: []
export function indexToData(indexes, dataArr) {

    var mappedIndexes = indexes.map(singleIndex => dataArr[singleIndex])
    return mappedIndexes

}

export function getXandYScales(scatterData, dimensions) {
    if (dimensions.length != 2) throw new Error('length of dimension must be 2')

    var data = scatterData.data
    var dim1Arr = data.map(el => el.x)
    var dim2Arr = data.map(el => el.y)

    var dim1Mean = mean(dim1Arr)
    var dim2Mean = mean(dim2Arr)
    var dim1Variance = standardDeviation(dim1Arr)
    var dim2Variance = standardDeviation(dim2Arr)

    return {
        'xScaleMin': dim1Mean - (dim1Variance * 5),
        'xScaleMax': dim1Mean + (dim1Variance * 5),
        'yScaleMin': dim2Mean - (dim2Variance * 5),
        'yScaleMax': dim2Mean + (dim2Variance * 5),
    }
}

export function useInterval(callback, delay) {
    // Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function retainedClusters(arr, parsedData, numOfRetainedClusters) {
    var clusterElements = parsedData.cluster.map(clusterIndex => parsedData.raw_data[clusterIndex])
    if (arr.length >= numOfRetainedClusters.value) {
        arr.shift()
        arr.push(clusterElements)
    } else {
        arr.push(clusterElements)
    }
    return arr
}

export function increase_brightness(hex, percent) {
    // Source: https://stackoverflow.com/questions/6443990/javascript-calculate-brighter-colour?noredirect=1&lq=1
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


export default { prepareData }