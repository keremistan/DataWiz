import React from 'react'
import { ResponsiveScatterPlot, ResponsiveScatterPlotCanvas } from '@nivo/scatterplot'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveScatterPlot = ({ data /* see data tab */, nodeSize, dimNames }) => (
    <ResponsiveScatterPlotCanvas
        data={data}
        nodeSize={nodeSize}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: -100, max: 120 }}
        yScale={{ type: 'linear', min: -100, max: 120 }}
        axisTop={null}
        axisRight={null}
        colors={{scheme: 'red_blue'}}
        blendMode={'lighten'}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: dimNames[0],
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: dimNames[1],
            legendPosition: 'middle',
            legendOffset: -60
        }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 130,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

export default MyResponsiveScatterPlot