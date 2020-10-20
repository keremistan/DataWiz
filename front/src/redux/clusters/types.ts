import { UPDATE_CLUSTERS, UPDATE_NUM_OF_RETAINED_CLUSTERS } from "../actions/actionTypes";


// export interface updateNumOfRetainedClustersType {
//     (numOfRetainedClusters: numOfRetainedClustersType): () => {type: typeof UPDATE_NUM_OF_RETAINED_CLUSTERS, payload: numOfRetainedClustersType}
// }
// export interface clusterFuncsTypes {
//     updateNumOfRetainedClustersType: (numOfRetainedClusters: numOfRetainedClustersType) => {type: typeof UPDATE_NUM_OF_RETAINED_CLUSTERS, payload: numOfRetainedClustersType}
// }
export interface numOfRetainedClustersType {
    value: number;
    bufferValue: number;
    valid: boolean;
}

// export interface retainedClustersType {
//     valid: boolean;
// }

export type updateNumOfRetainedClustersType = (numOfRetainedClusters: numOfRetainedClustersType) => {
    type: string,
    payload: numOfRetainedClustersType
}

export interface action {
    type: typeof UPDATE_NUM_OF_RETAINED_CLUSTERS | typeof UPDATE_CLUSTERS;
    payload: numOfRetainedClustersType | any[];
}