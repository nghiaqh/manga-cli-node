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
  folderPath,
  limit
} = parseProcessArgs()

if (!isFolder(folderPath)) process.exit(1)

/**
 * Rename sub directory of input folderPath
 * Original format: author, manga title
 * New format: [author] manga title
 */

const {
  folders
} = getFolderItems(folderPath)

for (const folder of folders.slice(0, Number(limit) || folders.length)) {
  const folderName = path.parse(folder).base.split('/').pop()
  const pattern = /([^,.]+), [^,.]+/
  const matches = pattern.exec(folderName)
  if (!matches) continue
  else {
    const newName = folderName.replace(`${matches[0]},`, `[${matches[0]}]`)
    const newPath = folder.replace(folderName, newName)
    fs.renameSync(folder, newPath)
  }
}
