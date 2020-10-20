import { SET_CLUSTERS_ON_RAW, RESET_CLUSTERS_ON_RAW, SET_UNCLUSTERED_RAW, SET_CLUSTERED_RAW, SET_SCALES } from '../actions/actionTypes'
import { action } from './rootReducer'

export interface scales {
    'xScaleMin': number,
    'xScaleMax': number,
    'yScaleMin': number,
    'yScaleMax': number,
}

const clustersOnRawInit = {
    id: 'microclusters',
    data: []
}

var initialState = {
    clustersOnRaw: makeDeepCopy(clustersOnRawInit),
    unclusteredRaw: null,
    clusteredRaw: null,
    scales: null
}

function makeDeepCopy(str: { id: string; data: never[] }) {
    return JSON.parse(JSON.stringify(str))
}


export default (state = initialState, action: action) => {
    switch (action.type) {
        case SET_CLUSTERS_ON_RAW:
            return {
                ...state,
                clustersOnRaw: action.payload
            }

        case RESET_CLUSTERS_ON_RAW:
            return {
                ...state,
                clustersOnRaw: makeDeepCopy(clustersOnRawInit)
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