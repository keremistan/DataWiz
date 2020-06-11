import { combineReducers } from 'redux'
import DimensionsReducer from './dimensionsReducer'
import ClustersReducer from './clustersReducer'
import ScattersReducer from './scattersReducer'

export default combineReducers({
    dimensions: DimensionsReducer,
    clusters: ClustersReducer,
    scatters: ScattersReducer
})

