const fs = require('fs');

// if the location changes it is sufficient to adapt this
const resultLocation = 'L:/Dokumente/AllResults';

// overall counter variables to be output later
let overallTruePositives = 0;
let overallFalseNegatives = 0;
let overallFalsePositives = 0;


const commits = fs.readdirSync(resultLocation)

commits.forEach(commit => {

    const clusters = fs.readdirSync(resultLocation + '/' + commit + '/Tracking');

    clusters.forEach(cluster => {

        const trackingData = fs.readFileSync(resultLocation + '/' + commit + '/Tracking/' + cluster, 'utf8')
        const lshData = fs.readFileSync(resultLocation + '/' + commit + '/LSH/' + cluster, 'utf8')
        const trackingDataLines = trackingData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");
        const lshDataLines = lshData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");

        // true positives inside the current cluster
        let truePositives = 0;

        trackingDataLines.forEach(line => {
            if (lshDataLines.includes(line)) {
                const indexToDelete = lshDataLines.findIndex(otherLine => { return line == otherLine });
                lshDataLines.splice(indexToDelete, 1);
                truePositives++;
            }
        })

        // false result within the current cluster
        const falseNegatives = trackingDataLines.length - truePositives;
        const falsePositives = lshDataLines.length;

        overallTruePositives += truePositives;
        overallFalseNegatives += falseNegatives;
        overallFalsePositives += falsePositives;


        if (falseNegatives > 0 || falsePositives > 0) {
            console.log(commit + '/' + cluster)
            console.log("true positives: " + truePositives)
            console.log("false negatives (missing): " + falseNegatives)
            console.log("false positives (too much): " + falsePositives)
            console.log();
        }

    })

})



// in the end: output overall results
console.log("Overall")
console.log("true positives: " + overallTruePositives)
console.log("false negatives (missing): " + overallFalseNegatives)
console.log("false positives (too much): " + overallFalsePositives)
console.log()