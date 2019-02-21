const fs = require('fs')
const path = require('path')

const {
  isFolder,
  getFolderItems
} = require('../src/fs')

const {
  parseProcessArgs
} = require('../src/cli')

const {
  folderPath
} = parseProcessArgs()

if (!isFolder(folderPath)) process.exit(1)

/**
 * Rename files inside input folderPath 00000 to files.length
 */

const {
  files
} = getFolderItems(folderPath)
console.log(files)
files.forEach((file, index) => {
  const fileName = path.parse(file).base.split('/').pop().split('.')[0]
  const newPath = file.replace(fileName, String(index).padStart(5, 0))
  fs.renameSync(file, newPath)
})
