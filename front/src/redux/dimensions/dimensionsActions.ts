import { SET_DIMENSIONS, UPDATE_CHOSEN_DIMENSIONS } from '../actionTypes'
import { allDimensionsType, chosenDimensionsType } from './dimensionsTypes'

export const setDimensions = (dimensions: allDimensionsType) => {
    return ({
        type: SET_DIMENSIONS,
        payload: dimensions
    })
}

export const chooseDimensions = (dimensions: chosenDimensionsType) => {
    return ({
        type: UPDATE_CHOSEN_DIMENSIONS,
        payload: dimensions
    })
}