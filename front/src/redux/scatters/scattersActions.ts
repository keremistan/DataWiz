import { SET_CLUSTERS_ON_RAW, RESET_CLUSTERS_ON_RAW, SET_UNCLUSTERED_RAW, SET_CLUSTERED_RAW, SET_SCALES } from '../actionTypes'
import { clustersOnRaw, dataPoint, scales } from './scattersTypes'


// TODO: this type might not be correct. Check it later.
export const setClustersOnRaw = (rawScatterData: dataPoint[]) => {
    return ({
        type: SET_CLUSTERS_ON_RAW,
        payload: rawScatterData
    })
}

export const resetClustersOnRaw = () => {
    return ({
        type: RESET_CLUSTERS_ON_RAW,
        payload: null
    })
}

export const setUnclusteredRaw = (unclusteredRaw: dataPoint[]) => {
    return ({
        type: SET_UNCLUSTERED_RAW,
        payload: unclusteredRaw
    })
}

export const setClusteredRaw = (clusteredRaw: clustersOnRaw) => {
    return ({
        type: SET_CLUSTERED_RAW,
        payload: clusteredRaw
    })
}

export const setScales = (scales: scales) => {
    return ({
        type: SET_SCALES,
        payload: scales
    })
}
