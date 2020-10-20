import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setDimensions, chooseDimensions } from '../redux/dimensions/dimensionsActions'
import { resetClustersOnRaw } from '../redux/scatters/scattersActions'

function Dimensions(props) {

    const dimensionChangeHandler = (event, index) => {
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
                                {props.allDimensions.map(category => {
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

const mapStateToProps = state => {
    const { dimensions } = state
    return {
        allDimensions: dimensions.allDimensions,
        chosenDimensions: dimensions.chosenDimensions,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setDimensions: setDimensions,
    chooseDimensions: chooseDimensions,
    resetClustersOnRaw: resetClustersOnRaw,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dimensions)