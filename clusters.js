const fs = require('fs');

// set commit timestamp to be analysed
const commit = "1611570081000";

// if the location changes it is sufficient to adapt this
const resultLocation = 'L:/Dokumente/AllResults';


// overall counter variables to be output later
let overallTruePositives = 0;
let overallFalseNegatives = 0;
let overallFalsePositives = 0;


// determine all files (i.e., clusters)
const lshFolder = resultLocation + '/' + commit + '/LSH';
const fileNames = fs.readdirSync(lshFolder);



fileNames.forEach(fileName => {

    // this type of file (which aggregates the others) should be ignored
    if (fileName !== "lshResults.txt") {

        // get the result lines in the current cluster/file
        const trackingData = fs.readFileSync(resultLocation + '/' + commit + '/Tracking/' + fileName, 'utf8')
        const lshData = fs.readFileSync(resultLocation + '/' + commit + '/LSH/' + fileName, 'utf8')
        const trackingDataLines = trackingData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");
        const lshDataLines = lshData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");

        // counter for later output
        let truePositives = 0;

        // check for each pair in the TS tracking if it is also in the LSH tracking
        trackingDataLines.forEach(line => {
            if (lshDataLines.includes(line)) {
                const indexToDelete = lshDataLines.findIndex(otherLine => { return line == otherLine });
                lshDataLines.splice(indexToDelete, 1);
                truePositives++;
            }
        })

        // false negatives and positives can be calculated like this
        const falseNegatives = trackingDataLines.length - truePositives;
        const falsePositives = lshDataLines.length;

        // add to overall results
        overallTruePositives += truePositives;
        overallFalseNegatives += falseNegatives;
        overallFalsePositives += falsePositives;

        // output results for current cluster if there are false results
        if (falseNegatives > 0 || falsePositives > 0) {
            console.log(fileName)
            console.log("true positives: " + truePositives)
            console.log("false negatives (missing): " + falseNegatives)
            console.log("false positives (too much): " + falsePositives)
            console.log();
        }
    }
});

// in the end: output overall results
console.log("Overall")
console.log("true positives: " + overallTruePositives)
console.log("false negatives (missing): " + overallFalseNegatives)
console.log("false positives (too much): " + overallFalsePositives)


