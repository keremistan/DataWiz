import React, { useEffect, useRef } from 'react';
import { mean, standardDeviation } from 'simple-statistics'
import { numOfRetainedClustersType } from '../redux/clusters/clusterTypes';
import { scales } from '../redux/scatters/scattersTypes';

interface dataFromServer {
    all_clusters: number[],
    cluster: number[],
    dimensions: string[],
    raw_data: number[][]
}

interface parsedData {
    [categories: string]: number[] | number[][] | string[],
    cluster: number[][],
    raw_data: number[][]
}

interface preparedDataType {
    [key: string]: Array<object>,
    cluster: Array<object>,
    raw_data: Array<object>
}

export function prepareData(dimensions: string[], data: parsedData): preparedDataType {
    let dataToBePrepared: string[] = ["cluster", "raw_data"]
    let preparedData: preparedDataType = { cluster: [], raw_data: [] }

    for (let i: number = 0; i < dataToBePrepared.length; i++) {
        for (let j: number = 0; j < dimensions.length; j++) {
            let dataPoint = data[dataToBePrepared[i]][j]
            let tempDataPoint: { [category: string]: number } = {}

            dimensions.map((dimension, index) => {
                tempDataPoint[dimension] = (dataPoint as number[])[index]
            })
            preparedData[dataToBePrepared[i]][j] = tempDataPoint
            tempDataPoint = {}
        }
    }

    return preparedData
}

interface dataPointType {
    x: number,
    y: number
}

type dimensionsType = number[]

export function unclusteredScatter(dimensions: dimensionsType, data: { raw_data: number[][] }): { id: string, data: dataPointType[] } {
    if (dimensions.length !== 2) throw new Error('not 2 dimensional')
    var first_dim = dimensions[0]
    var second_dim = dimensions[1]
    var scatterData = []
    if (data == null) return { id: '', data: [] }
    var raw_data = data.raw_data
    var firstDimData = raw_data.map(dataPoint => dataPoint[first_dim])
    var secondDimData = raw_data.map(dataPoint => dataPoint[second_dim])

    var dataPoints: dataPointType[] = []
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

export function clusteredScatter(dimensions: number[], data: { raw_data: number[][], all_clusters: number[] }) {
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

export function forScatter(
    dimensions: dimensionsType,
    data: {
        cluster: number[],
        raw_data: number[][]
    },
    scatterData: {
        id: string,
        data:
        {
            x: number,
            y: number,
            radius: number,
            normalizedRadius: number
        }[]
    },
    maxNumOfEl = 10
) {
    if (dimensions.length !== 2) throw new Error('not 2 dimensional')
    var first_dim = dimensions[0]
    var second_dim = dimensions[1]
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
    // var radius = parseInt(Math.max(radiusX, radiusY))
    // var x = parseInt(L1 / N)
    // var y = parseInt(L2 / N)
    var radius = Math.max(radiusX, radiusY)
    var x = L1 / N
    var y = L2 / N

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

export function indexToData(indexes: number[], dataArr: number[][]) {

    var mappedIndexes = indexes.map(singleIndex => dataArr[singleIndex])
    return mappedIndexes

}

export function getXandYScales(scatterData: { id: string, data: dataPointType[] }, dimensions: number[]): scales {
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

type refObj = () => void

export function useInterval(callback: refObj, delay: number) {
    // Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    const savedCallback = useRef<refObj>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function retainedClusters(
    arr: Array<number[][]>,
    parsedData: dataFromServer,
    numOfRetainedClusters: numOfRetainedClustersType
) {
    var clusterElements = parsedData.cluster.map(clusterIndex => parsedData.raw_data[clusterIndex])
    if (arr.length >= numOfRetainedClusters.value) {
        arr.shift()
        arr.push(clusterElements)
    } else {
        arr.push(clusterElements)
    }
    return arr
}

export function increase_brightness(hex: string, percent: number) {
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