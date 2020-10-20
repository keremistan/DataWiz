export type allDimensionsType = string[]
export type chosenDimensionsType = number[]

export type chooseDimensionsType = (dims: chosenDimensionsType) => { type: string, payload: chosenDimensionsType }
export type setDimensionsType = (dims: allDimensionsType) => { type: string, payload: allDimensionsType }

export interface dimensionsVariableType {
    allDimensions: allDimensionsType,
    chosenDimensions: chosenDimensionsType
}