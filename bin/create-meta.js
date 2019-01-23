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

/**
 * Create metadata.json for manga and chapter
 * TODO: add support for volume next
 *
 * Usage:
 * node bin/create-meta.js <folder-path> -t <content type>
 *
 * Example:
 * node bin/create-meta.js /mnt/d/h -t manga
 * node bin/create-meta.js /mnt/c/home/h/[author a]\ book b -t chapter
 */
createMetadataFiles(folderPath, type, limit)
