const fs = require('fs');

// if the location changes it is sufficient to adapt this
const resultLocation = 'L:/Dokumente/AllResults';

// overall counter variables to be output later
let overallTruePositives = 0;
let overallFalseNegatives = 0;
let overallFalsePositives = 0;

// contains for each strategy (1-5) the number of pairs it matched
const matchingStrategies = [0, 0, 0, 0, 0]

const commits = fs.readdirSync(resultLocation)

commits.forEach(commit => {

    const clusters = fs.readdirSync(resultLocation + '/' + commit + '/Tracking');

    clusters.forEach(cluster => {

        // read baseline data (e.g., Tracking) and test data (e.g., LSH) 
        const baselineData = fs.readFileSync(resultLocation + '/' + commit + '/Tracking/' + cluster, 'utf8')
        const testData = fs.readFileSync(resultLocation + '/' + commit + '/LSH/' + cluster, 'utf8')

        // split into lines
        let baselineDataLines = baselineData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");
        let testDataLines = testData.split(/\r\n|\r|\n/).filter(line => line != "" && line != "\x1A");

        // get rid of same pairs
        baselineDataLines = Array.from(new Set(baselineDataLines));
        testDataLines = Array.from(new Set(testDataLines));

        // true positives inside the current cluster
        let truePositives = 0;

        // for each baseline data line: check if also in test data
        baselineDataLines.forEach(line => {
            // TODO uncomment slice part for 'Solutions' comparison
            const lineWithoutStrategy = line.slice(0, -2)
            if (testDataLines.includes(lineWithoutStrategy)) {
                const indexToDelete = testDataLines.findIndex(otherLine => { return lineWithoutStrategy == otherLine });
                testDataLines.splice(indexToDelete, 1);
                truePositives++;
            }
            // TODO uncomment for 'Solutions' comparison
            matchingStrategies[Number(line.slice(-1)) - 1]++;
        })

        // false result within the current cluster
        const falseNegatives = baselineDataLines.length - truePositives;    // everything that is in baseline, but not in test is false negative
        const falsePositives = testDataLines.length;                        // true positives were deleted, rest is false positives

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

console.log("Number of matched pairs for each strategy: " + matchingStrategies)