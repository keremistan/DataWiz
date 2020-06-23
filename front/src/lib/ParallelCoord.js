import React from 'react';
import { ResponsiveParallelCoordinates, ResponsiveParallelCoordinatesCanvas } from '@nivo/parallel-coordinates'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveParallelCoordinates = ({ data, variables }) => (

    // <ResponsiveParallelCoordinates
    <ResponsiveParallelCoordinatesCanvas
        data={data}
        variables={variables}
        lineOpacity={0.5}
        colors={{ scheme: 'dark2' }}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
    />
)

export default MyResponsiveParallelCoordinates