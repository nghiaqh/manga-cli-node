const {
  parseProcessArgs
} = require('../src/cli')
const {
  createMetadataFiles
} = require('../src/create-metadata')

const {
  folderPath,
  limit,
  type
} = parseProcessArgs()

createMetadataFiles(folderPath, type, limit)
