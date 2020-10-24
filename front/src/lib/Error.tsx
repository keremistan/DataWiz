import React from 'react'

export function DataAbsentError(){
    return (
        <div className="data-absent-error error" > Null is returned instead of data. Make sure there is data in the storage to be displayed.</div>
    )
}

export function ResourceNotFoundError(){
    return (
        <div className="resource-not-found-error error" >No resource with the given ID found.</div>
    )
}

export function ServerDownError(){
    return (
        <div className="server-down-error error" >500 - Server not responding.</div>
    )
}