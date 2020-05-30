export function onRenderProfilerHandler(qty_of_points, id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver) {
    // if(startTime > 8000 && startTime <10000){ // 8-10 saniye
    fetch('/testresults/' + qty_of_points, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileSaver)
    })
    // }
    return {
        id: id,
        phase: phase,
        actualDuration: actualDuration,
        baseDuration: baseDuration,
        startTime: startTime,
        commitTime: commitTime,
        interactions: interactions
    }
}

// TODO: otomatik data point miktarini nerden ayarlicam?
// todo: browser yeniden nasil baslatacam?