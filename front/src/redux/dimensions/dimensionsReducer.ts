import { SET_DIMENSIONS, UPDATE_CHOSEN_DIMENSIONS } from '../actionTypes'
import { actionType } from './dimensionsTypes'

var initialState = {
    allDimensions: [],
    chosenDimensions: [0, 1]
}

export default (state = initialState, action: actionType) => {
    switch (action.type) {
        
        case SET_DIMENSIONS:
            return {
                ...state,
                allDimensions: action.payload
            }

        case UPDATE_CHOSEN_DIMENSIONS:
            return {
                ...state,
                chosenDimensions: action.payload
            }

        default:
            return state
    }
}