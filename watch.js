const chokidar = require('chokidar')
const getLastLines = require('./filetools.js').getLastLines
var path = require("path")
var post = require('./post')
var config = require('./config')

console.log(now(), 'Starting UCM Watcher')
console.log(`
    ********************************
    Do not close this windows. This is watching UCM for events.
    ********************************
`)

const watcher = chokidar.watch(config.localDatabaseFileName, {
    ignoreInitial: true,
    ignored:  /EvAD/g, 
    usePolling: true,
    persistent: true
})

watcher
  .on('add', function(watchedFile) {
    console.log(now(), 'New File Added', watchedFile)
  })
  .on('change', function(watchedFile) {
    console.log(now(), 'File changed', watchedFile)
    readLastLine(watchedFile)
  })

function readLastLine(fileName) {
    const minLineLength = 1
    getLastLines(fileName, minLineLength)
        .then((lastLine)=> {
            lastLine.forEach(function(l) {
                procLine = processLine(l, fileName)
                console.log(procLine)
                post.newEvent(procLine)
                .then(() => {
                    console.log(now(), 'Post Success')
                }) 
                .catch((err) => {
                    console.error(err)
                })
            })
        })
        .catch((err)=> {
            console.error(err)
        })
}

function processLine(line, fileName) {
    var ret
    var arrLine = line.split('\t')
    if (arrLine.length === 5) {
        ret = {
            date: arrLine[0] || '',
            device: arrLine[1] || '',
            point: arrLine[2] || '',
            status: arrLine[3] || '',
            desc: arrLine[4] || '',
            rawline: line,
            filename: path.basename(fileName)
        }
    } else {
        ret = {
            date: arrLine[0] || '',
            desc: arrLine[3] || '',
            rawline: line,
            filename: path.basename(fileName)
        }
    }
    return ret
}

function now() {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
