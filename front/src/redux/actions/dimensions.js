import { SET_DIMENSIONS, UPDATE_CHOSEN_DIMENSIONS } from './actionTypes'

export const setDimensions = dimensions => {
    return ({
        type: SET_DIMENSIONS,
        payload: dimensions
    })
}

export const chooseDimensions = dimensions => {
    return ({
        type: UPDATE_CHOSEN_DIMENSIONS,
        payload: dimensions
    })
}