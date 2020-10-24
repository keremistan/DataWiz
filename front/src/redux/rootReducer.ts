import { combineReducers } from 'redux'
import DimensionsReducer from './dimensions/dimensionsReducer'
import ClustersReducer from './clusters/clusterReducers'
import ScattersReducer from './scatters/scattersReducer'

export default combineReducers({
    dimensions: DimensionsReducer,
    clusters: ClustersReducer,
    scatters: ScattersReducer
})

