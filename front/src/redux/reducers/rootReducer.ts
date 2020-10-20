import { combineReducers } from 'redux'
import DimensionsReducer from './dimensionsReducer'
import ClustersReducer from '../clusters/reducers'
import ScattersReducer from './scattersReducer'
import { RESET_CLUSTERS_ON_RAW, UPDATE_NUM_OF_RETAINED_CLUSTERS } from '../actions/actionTypes'

export interface action {
    // type: (string | typeof RESET_CLUSTERS_ON_RAW | typeof UPDATE_NUM_OF_RETAINED_CLUSTERS);
    type: string;
    payload: string | null;
}

export default combineReducers({
    dimensions: DimensionsReducer,
    clusters: ClustersReducer,
    scatters: ScattersReducer
})

