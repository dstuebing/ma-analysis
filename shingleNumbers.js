const fs = require('fs');

// if the location changes it is sufficient to adapt this
const resultLocation = 'L:/Dokumente/AllResults';

let maximumNumberOfShingles = 0;
let minimumNumberOfShingles = 100000000;


const commits = fs.readdirSync(resultLocation)

commits.forEach(commit => {

    const twoNumbers = fs.readFileSync(resultLocation + '/' + commit + '/ShingleNumbers/shingleNumbers.txt', 'utf8')
    if (twoNumbers !== "2147483647,0") {
        const split = twoNumbers.split(",");
        console.log(split)

        if (split[0] < minimumNumberOfShingles) {
            minimumNumberOfShingles = parseInt(split[0])
        }

        if (split[1] > maximumNumberOfShingles) {
            maximumNumberOfShingles = parseInt(split[1])
        }
    }

})


console.log("MIN: " + minimumNumberOfShingles);
console.log("MAX: " + maximumNumberOfShingles);