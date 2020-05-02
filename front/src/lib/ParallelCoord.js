import React from 'react';
import { ResponsiveParallelCoordinates, ResponsiveParallelCoordinatesCanvas } from '@nivo/parallel-coordinates'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveParallelCoordinates = ({ data }) => (

    <ResponsiveParallelCoordinates
    //<ResponsiveParallelCoordinatesCanvas
        data={data}
        variables={[
            {
                key: 'cpu',
                type: 'linear',
                min: 'auto',
                max: 'auto',
                ticksPosition: 'before',
                legend: 'cpu',
                legendPosition: 'start',
                legendOffset: 20
            },
            {
                key: 'traffic',
                type: 'linear',
                min: 'auto',
                max: 'auto',
                ticksPosition: 'before',
                legend: 'traffic',
                legendPosition: 'start',
                legendOffset: 20
            },
            {
                key: 'ram',
                type: 'linear',
                padding: 1,
                min: 'auto',
                max: 'auto',
                legend: 'ram',
                legendPosition: 'start',
                legendOffset: -20
            },
            {
                key: 'io',
                type: 'linear',
                padding: 0,
                min: 'auto',
                max: 'auto',
                legend: 'io',
                legendPosition: 'start',
                legendOffset: -20
            },
            {
                key: 'energy',
                type: 'linear',
                min: 'auto',
                max: 'auto',
                legend: 'energy',
                legendPosition: 'start',
                legendOffset: -20
            }
        ]}
        colors={{ scheme: 'oranges' }}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        animate={true}
        motionStiffness={90}
        motionDamping={12}
    />
)

export default MyResponsiveParallelCoordinates