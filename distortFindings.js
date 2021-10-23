const fs = require('fs');
const types = ["int", "String", "double", "boolean", "char"]
const operators = ["+", "-", "*", "/", "."]
const randomWords = require('random-words');
const names = Array.from(new Set(randomWords(3000)))

// TODO adapt path and file name to the used project and its name
const projectPath = "L:/tsma"
let jsonFileContent = fs.readFileSync('findings-tsma.json', 'utf8')
// End TODO


// Step 1: cluster findings by their file names
const jsonParsed = JSON.parse(jsonFileContent)
const findingsByPathMap = new Map()

jsonParsed.forEach(finding => {
    const path = finding.Location.split(':')[0]
    if (findingsByPathMap.has(path)) {
        const existingList = findingsByPathMap.get(path)
        existingList.push(finding)
    } else {
        findingsByPathMap.set(path, [finding])
    }
});




// Step 2: make changes to the file system and accordingly to the line nrs of the findings in the map
for (let path of findingsByPathMap.keys()) {
    // leave 50 % of files alone
    if (getRandomInt(2) == 0) {
        continue
    }

    // get file content and split it into lines
    const fileContent = fs.readFileSync(projectPath + '/' + path, 'utf8')
    const lines = fileContent.split("\n")

    // the findings in the file at the given path
    const findingsArray = findingsByPathMap.get(path);

    // add some lines to file
    const numberOfLinesToAdd = Math.ceil(lines.length / 5)
    for (let i = 0; i < numberOfLinesToAdd; i++) {
        // add random line at random line
        const indexToAddLine = getRandomInt(lines.length) + 1
        const lineToAdd = generateRandomLine()
        lines.splice(indexToAddLine - 1, 0, lineToAdd);

        // update all findings in file
        for (let finding of findingsArray) {
            //finding = findingsArray[0]
            const startAndEnd = determineStartAndEndOfFinding(finding)
            if (startAndEnd == undefined) {
                // some findings (e.g., architecture, file size) have no start & end -> no need to update
                continue
            }
            const start = startAndEnd[0]
            const end = startAndEnd[1]
            if (indexToAddLine <= start) {
                // finding was moved down by one (reference: this also updates the value in the map!)
                finding.Location = buildLocationString(path, start + 1, end + 1)
            } else if (start < indexToAddLine && indexToAddLine <= end) {
                // finding is now 1 line longer (reference: this also updates the value in the map!)
                finding.Location = buildLocationString(path, start, end + 1)
            }
        }
    }

    // after all the changes: write changed lines back to file (it must be overwritten)
    let fileContentWithAddedLines = "";
    lines.forEach(line => fileContentWithAddedLines = fileContentWithAddedLines + "\n" + line)
    // remove the superfluous new line in beginning
    fileContentWithAddedLines = fileContentWithAddedLines.substring(1)
    // write to file
    try {
        fs.writeFileSync(projectPath + '/' + path, fileContentWithAddedLines)
    } catch (err) {
        console.error(err)
    }
}






// Step 3: build output and write to file
const outputFindings = []
for (let path of findingsByPathMap.keys()) {
    for (let finding of findingsByPathMap.get(path)) {
        outputFindings.push(finding)
    }
}
const stringified = JSON.stringify(outputFindings)

// write to file
try {
    fs.writeFileSync('result.json', stringified)
} catch (err) {
    console.error(err)
}






/** HELPER FUNCTIONS */

/**
 * Returns the start and end number for given finding. If not given, returns undefined.
 * 
 * @param {*} finding 
 * @returns 
 */
function determineStartAndEndOfFinding(finding) {
    const numbers = finding.Location.split(':')[1]
    if (numbers != undefined) {
        const number0 = Number(numbers.split('-')[0])
        const number1 = Number(numbers.split('-')[1])
        return [number0, number1]
    } else {
        return undefined
    }
}


/**
 * Determines among the given findings the ones that are in the given range.
 * 
 * @param {*} start 
 * @param {*} end 
 * @param {*} findings 
 * @returns 
 */
function determineFindingsInRange(start, end, findings) {
    const findingsInRange = findings.filter(finding => {
        const currentStartAndEnd = determineStartAndEndOfFinding(finding)
        if (start == currentStartAndEnd[0] && currentStartAndEnd[1] == end) {
            // we do not want the long method finding itself
            return false
        } else if (start <= currentStartAndEnd[0] && currentStartAndEnd[1] <= end) {
            return true
        }
    })

    return findingsInRange
}


/**
 * Returns a random int between 0 and (exclusiveMax - 1). 
 * 
 * @param {*} exclusiveMax 
 * @returns 
 */
function getRandomInt(exclusiveMax) {
    return Math.floor(Math.random() * exclusiveMax);
}


/**
 * Generates a random line of the structure TYPE NAME = NAME OP NAME.
 * 
 * @returns 
 */
function generateRandomLine() {
    return types[getRandomInt(types.length)] + " " + names[getRandomInt(names.length)] + " = " + names[getRandomInt(names.length)] + operators[getRandomInt(operators.length)] + names[getRandomInt(names.length)] + ";"
}


/**
 * 
 * @param {*} path 
 * @param {*} start 
 * @param {*} end 
 */
function buildLocationString(path, start, end) {
    return path + ":" + start + "-" + end
}


