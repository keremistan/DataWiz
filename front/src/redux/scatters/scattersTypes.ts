export interface scales {
    'xScaleMin': number,
    'xScaleMax': number,
    'yScaleMin': number,
    'yScaleMax': number,
}

export type actionType = {
    type: string,
    payload: number[] | scales
}

export type resetClustersOnRawType = () => {type: string, payload: null}

export type dataPoint = {
    x: number,
    y: number,
    radius: number
}

export type clustersOnRaw = {
    id: string,
    data: dataPoint[]
}