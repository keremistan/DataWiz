import { combineReducers } from 'redux'
import DimensionsReducer from './dimensions/dimensionsReducer'
import ClustersReducer from './clusters/clusterReducers'
import ScattersReducer from './scatters/scattersReducer'

export interface action {
    type: string;
    payload: string | null;
}

export default combineReducers({
    dimensions: DimensionsReducer,
    clusters: ClustersReducer,
    scatters: ScattersReducer
})

