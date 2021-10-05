const fs = require('fs')


// the sum of times spent in each strategy over all commits and clusters
let strat1Time = 0;
let strat2Time = 0;
let strat3Time = 0;
let strat4Time = 0;
let strat5Time = 0;

// the number of clusters that entered each strategy. The number of the first strategy equals the total number of clusters
let numberOfTimesStrat1Exec = 0;
let numberOfTimesStrat2Exec = 0;
let numberOfTimesStrat3Exec = 0;
let numberOfTimesStrat4Exec = 0;
let numberOfTimesStrat5Exec = 0;


const resultLocation = 'L:/Dokumente/AllResults';
const commits = fs.readdirSync(resultLocation)

commits.forEach(commit => {

    const clusters = fs.readdirSync(resultLocation + '/' + commit + '/Tracking');

    clusters.forEach(cluster => {

        const executionTimes = fs.readFileSync(resultLocation + '/' + commit + '/Time/' + cluster, 'utf8')
        const strategyTimes = executionTimes.split(";");

        strat1Time += parseInt(strategyTimes[1], 10)
        strat2Time += parseInt(strategyTimes[2], 10)
        strat3Time += parseInt(strategyTimes[3], 10)
        strat4Time += parseInt(strategyTimes[4], 10)
        strat5Time += parseInt(strategyTimes[5], 10)

        if (parseInt(strategyTimes[1], 10) != 0) {
            numberOfTimesStrat1Exec++;
        }
        if (parseInt(strategyTimes[2], 10) != 0) {
            numberOfTimesStrat2Exec++;
        }
        if (parseInt(strategyTimes[3], 10) != 0) {
            numberOfTimesStrat3Exec++;
        }
        if (parseInt(strategyTimes[4], 10) != 0) {
            numberOfTimesStrat4Exec++;
        }
        if (parseInt(strategyTimes[5], 10) != 0) {
            numberOfTimesStrat5Exec++;
        }
    })
})

const totalTime = strat1Time + strat2Time + strat3Time + strat4Time + strat5Time;

console.log("Strategy 1 Time: " + strat1Time)
console.log("Strategy 2 Time: " + strat2Time)
console.log("Strategy 3 Time: " + strat3Time)
console.log("Strategy 4 Time: " + strat4Time)
console.log("Strategy 5 Time: " + strat5Time)
console.log("Total Time: " + totalTime)

console.log()

console.log("Number of times strategy 1 executed: " + numberOfTimesStrat1Exec)
console.log("Number of times strategy 2 executed: " + numberOfTimesStrat2Exec)
console.log("Number of times strategy 3 executed: " + numberOfTimesStrat3Exec)
console.log("Number of times strategy 4 executed: " + numberOfTimesStrat4Exec)
console.log("Number of times strategy 5 executed: " + numberOfTimesStrat5Exec)

