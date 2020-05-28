export function onRenderProfilerHandler(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, profileSaver) {
    if(startTime > 30000 && startTime <60000){ // 3~6 dk kadaki degerleri yakala
        console.log(profileSaver);
    }
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