import { UPDATE_CLUSTERS, UPDATE_NUM_OF_RETAINED_CLUSTERS } from "../actionTypes";

export interface numOfRetainedClustersType {
    value: number;
    bufferValue: number;
    valid: boolean;
}

export type updateNumOfRetainedClustersType = (numOfRetainedClusters: numOfRetainedClustersType) => {
    type: string,
    payload: numOfRetainedClustersType
}

export interface action {
    type: typeof UPDATE_NUM_OF_RETAINED_CLUSTERS | typeof UPDATE_CLUSTERS;
    payload: numOfRetainedClustersType | any[];
}