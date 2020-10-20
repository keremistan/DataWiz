import { numOfRetainedClustersType } from './clusterTypes'
import { UPDATE_CLUSTERS, UPDATE_NUM_OF_RETAINED_CLUSTERS } from '../actionTypes'

export const updateClusters = (clusters: any[]) => {
    return ({
        type: UPDATE_CLUSTERS,
        payload: clusters
    })
}

export const updateNumOfRetainedClusters = (numOfRetainedClusters: numOfRetainedClustersType) => {
    return ({
        type: UPDATE_NUM_OF_RETAINED_CLUSTERS,
        payload: numOfRetainedClusters
    })
}