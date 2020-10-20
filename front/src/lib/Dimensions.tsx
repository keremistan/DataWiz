import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux'
import { chooseDimensions } from '../redux/dimensions/dimensionsActions'
import { allDimensionsType, chooseDimensionsType, chosenDimensionsType, dimensionsVariableType } from '../redux/dimensions/dimensionsTypes';
import { resetClustersOnRaw, resetClustersOnRawType } from '../redux/scatters/scattersActions'

type stateProps = {
    dimensions: dimensionsVariableType
}

type dispatchProps = {
    chooseDimensions: chooseDimensionsType,
    resetClustersOnRaw: resetClustersOnRawType
}

type Props = dispatchProps & {
    chosenDimensions: chosenDimensionsType,
    allDimensions: allDimensionsType,
}

function Dimensions(props: Props) {

    const dimensionChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>, index: number): void => {
        var newScatterDims = index === 0
            ? [props.allDimensions.indexOf(event.target.value), props.chosenDimensions[1]]
            : [props.chosenDimensions[0], props.allDimensions.indexOf(event.target.value)]

        props.chooseDimensions(newScatterDims)
        props.resetClustersOnRaw()
    }

    return (
        <div className="dimensionsControlWrapper">
            <div className="choose-dim">
                {
                    ["First Dimension", "Second Dimension"].map((dim, index) => {
                        return <div>
                            <span>{dim}</span>
                            {/* dimension names are shown differently than they actually are. */}
                            <select defaultValue={props.allDimensions[props.chosenDimensions[index]]} onChange={e => dimensionChangeHandler(e, index)}>
                                {props.allDimensions.map((category: string) => {
                                    return <option value={category} > {category} </option>
                                })}
                            </select>
                        </div>
                    })
                }
            </div>

        </div>
    )
}

const mapStateToProps = (state: stateProps): dimensionsVariableType => {
    const { dimensions } = state
    return {
        allDimensions: dimensions.allDimensions,
        chosenDimensions: dimensions.chosenDimensions,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => bindActionCreators({
    chooseDimensions: chooseDimensions,
    resetClustersOnRaw: resetClustersOnRaw,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions)