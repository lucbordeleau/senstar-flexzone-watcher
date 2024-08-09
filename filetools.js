const fs = require('fs')
const readline = require('readline')
const Stream = require('stream')

exports.getLastLines = (fileName, minLength) => {
    let inStream = fs.createReadStream(fileName)
    let outStream = new Stream
    return new Promise((resolve, reject)=> {
        let rl = readline.createInterface(inStream, outStream)

        let lastLine = ''
        let beforeLastLine = ''
        rl.on('line', function (line) {
            if (line.length >= minLength) {
                beforeLastLine = lastLine
                lastLine = line
            }
        })

        rl.on('error', reject)

        rl.on('close', function () {
            resolve([beforeLastLine, lastLine])
        })
    })
}