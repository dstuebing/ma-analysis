const fs = require('fs');

// if the location changes it is sufficient to adapt this
const resultLocation = 'L:/Dokumente/AllResults';

let maximumNumberOfShingles = 0;
let minimumNumberOfShingles = 100000000;

let totalNumberOfPairs = 0;

const commits = fs.readdirSync(resultLocation)

commits.forEach(commit => {

    const twoNumbers = fs.readFileSync(resultLocation + '/' + commit + '/ShingleNumbers/shingleNumbers.txt', 'utf8')
    if (twoNumbers !== "2147483647,0") {
        const split = twoNumbers.split(",");

        if (split[0] < minimumNumberOfShingles) {
            minimumNumberOfShingles = parseInt(split[0])
        }

        if (split[1] > maximumNumberOfShingles) {
            maximumNumberOfShingles = parseInt(split[1])
        }
    }

    // also print the total number of candidates
    const clusters = fs.readdirSync(resultLocation + '/' + commit + '/Pairs');

    clusters.forEach(cluster => {
        const currentNumber = parseInt(fs.readFileSync(resultLocation + '/' + commit + '/Pairs/' + cluster, 'utf8'))
        totalNumberOfPairs += currentNumber
    })
})


console.log("MIN: " + minimumNumberOfShingles);
console.log("MAX: " + maximumNumberOfShingles);
console.log("#pairs: " + totalNumberOfPairs)