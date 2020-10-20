// import * as React from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux'
import { updateNumOfRetainedClusters } from '../redux/clusters/actions'
import { resetClustersOnRaw, resetClustersOnRawType } from '../redux/actions/scatters'
import { numOfRetainedClustersType, updateNumOfRetainedClustersType } from '../redux/clusters/types';

// TODO: regroup actions and reducers acc to their areas. Also add "types" into their own files.
interface ActionProps {
    updateNumOfRetainedClusters: updateNumOfRetainedClustersType;
    resetClustersOnRaw: resetClustersOnRawType;
}

interface StateProps {
    numOfRetainedClusters: numOfRetainedClustersType;
}

function ControlPanel(props: StateProps & ActionProps) {

    const submitRetainedClusters = (event: React.MouseEvent<HTMLElement>) => {
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

    const retainedClustersChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(event.target.value, 10)
        let isValid = true
        if (isNaN(val) || val <= 0) {
            isValid = false
            props.updateNumOfRetainedClusters({
                ...props.numOfRetainedClusters,
                bufferValue: val,
                valid: isValid
            })
        } else {
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


interface ControlPanelState {
    clusters: any;
}

interface ControlPanelProps { }

// TODO: change the any type
// const mapStateToProps = (state: {clusters: any}) => {
const mapStateToProps = (state: ControlPanelState): StateProps => {
    const { clusters } = state
    return {
        numOfRetainedClusters: clusters.numOfRetainedClusters,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): ActionProps => bindActionCreators({
    updateNumOfRetainedClusters,
    resetClustersOnRaw,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)