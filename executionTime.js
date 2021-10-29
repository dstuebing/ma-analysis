const fs = require('fs')


const resultLocation = 'L:/Dokumente/AllResults';
const commits = fs.readdirSync(resultLocation)

// winners
let numberOfClustersWonByLSH = 0;
let numberOfClustersWonByTracking = 0;
let numberOfClustersWithSameTime = 0;

// overall
let overallLSHTime = 0;
let overallTrackingTime = 0;


commits.forEach(commit => {

    const clusters = fs.readdirSync(resultLocation + '/' + commit + '/Tracking');

    clusters.forEach(cluster => {
        const executionTimes = fs.readFileSync(resultLocation + '/' + commit + '/Time/' + cluster, 'utf8')
        const strategyTimes = executionTimes.split(";");

        const tsTime = parseInt(strategyTimes[1], 10) + parseInt(strategyTimes[2], 10) + parseInt(strategyTimes[3], 10) + parseInt(strategyTimes[4], 10) + parseInt(strategyTimes[5], 10)
        const lshTime = parseInt(strategyTimes[0], 10)

        if (lshTime === tsTime) {
            numberOfClustersWithSameTime++;
        } else if (lshTime > tsTime) {
            numberOfClustersWonByTracking++;
        } else {
            numberOfClustersWonByLSH++;
        }

        overallLSHTime += lshTime;
        overallTrackingTime += tsTime;

    })


})


console.log("Number of clusters won by tracking: " + numberOfClustersWonByTracking)
console.log("Number of clusters won by LSH: " + numberOfClustersWonByLSH)
console.log("Number of clusters with equal time: " + numberOfClustersWithSameTime)

console.log("Overall LSH Time: " + overallLSHTime)
console.log("Overall Tracking Time: " + overallTrackingTime)





