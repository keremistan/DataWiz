import { SET_CLUSTERS_ON_RAW, RESET_CLUSTERS_ON_RAW, SET_UNCLUSTERED_RAW, SET_CLUSTERED_RAW, SET_SCALES } from '../actions/actionTypes'

var initialState = {
    clustersOnRaw: null,
    unclusteredRaw: null,
    clusteredRaw: null,
    scales: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CLUSTERS_ON_RAW:
            return {
                ...state,
                clustersOnRaw: action.payload
            }

        case RESET_CLUSTERS_ON_RAW:
            return {
                ...state,
                clustersOnRaw: action.payload
            }

        case SET_UNCLUSTERED_RAW:
            return {
                ...state,
                unclusteredRaw: action.payload
            }

        case SET_CLUSTERED_RAW:
            return {
                ...state,
                clusteredRaw: action.payload
            }

        case SET_SCALES:
            return {
                ...state,
                scales: action.payload
            }

        default:
            return state
    }
}