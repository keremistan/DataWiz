import { UPDATE_CLUSTERS, UPDATE_NUM_OF_RETAINED_CLUSTERS } from '../actions/actionTypes'
import { action } from './types'

var initialState = {
    clustersWithRawData: [],
    numOfRetainedClusters: {
        value: 10,
        bufferValue: 10,
        valid: true
    }
}

export default (state = initialState, action: action) => {
    switch (action.type) {
        case UPDATE_CLUSTERS:
            return {
                ...state,
                clustersWithRawData: action.payload
            }

        case UPDATE_NUM_OF_RETAINED_CLUSTERS:
            return {
                ...state,
                numOfRetainedClusters: action.payload
            }

        default:
            return state
    }
}