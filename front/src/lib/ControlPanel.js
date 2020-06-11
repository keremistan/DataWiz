import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { updateNumOfRetainedClusters } from '../redux/actions/clusters'
import { resetClustersOnRaw } from '../redux/actions/scatters'


function ControlPanel(props) {

    const submitRetainedClusters = event => {
        event.preventDefault()


        if (props.numOfRetainedClusters.valid) {
            props.updateNumOfRetainedClusters({
                ...props.numOfRetainedClusters,
                value: props.numOfRetainedClusters.bufferValue
            })
            props.resetClustersOnRaw()
        } else {
            props.updateNumOfRetainedClusters({
                ...props.numOfRetainedClusters,
                bufferValue: props.numOfRetainedClusters.value,
                valid: true
            })
        }

    }

    const retainedClustersChangeHandler = event => {
        let val = event.target.value
        let isValid = true
        if (isNaN(val) || val == "" || val <= 0) {
            // TODO: show some error about the input being unexpected type

            isValid = false
            props.updateNumOfRetainedClusters({
                ...props.numOfRetainedClusters,
                bufferValue: val,
                valid: isValid
            })
        } else {
            val = parseInt(val, 10)
            props.updateNumOfRetainedClusters({
                ...props.numOfRetainedClusters,
                bufferValue: val,
                valid: isValid
            })
        }
    }


    return (
        <div className="controlPanelWrapper">
            <form className="control-panel">
                <div className="retained-clusters-wrapper">
                    <label className="retained-clusters-label">Retained Clusters: </label>
                    <input type="retained-clusters"
                        className="retained-clusters-input"
                        value={props.numOfRetainedClusters.bufferValue}
                        onChange={retainedClustersChangeHandler}
                    />
                </div>
                <button className="control-submitter" type="submit" onClick={submitRetainedClusters}>Update</button>
            </form>
        </div>
    )

}



const mapStateToProps = state => {
    const { clusters } = state
    return {
        numOfRetainedClusters: clusters.numOfRetainedClusters,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    updateNumOfRetainedClusters: updateNumOfRetainedClusters,
    resetClustersOnRaw: resetClustersOnRaw,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)