const {
  parseProcessArgs
} = require('../src/cli')
const {
  scanFolder
} = require('../src/fs')
const {
  createContent
} = require('../src/create-content')

const {
  folderPath,
  limit
} = parseProcessArgs()

scanFolder(folderPath, createContent, {}, limit)
