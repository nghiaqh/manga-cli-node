const fs = require('fs')

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

main(folderPath)

/**
 * Rename sub directory of input folderPath
 * Original format: author, manga title
 * New format: [author] manga title
 */

function main (folderPath) {
  if (!isFolder(folderPath)) return
  const {
    files,
    folders
  } = getFolderItems(folderPath)

  const metadataFile = `${folderPath}/metadata.json`

  console.log(metadataFile)
  if (files.indexOf(metadataFile) > -1) {
    const data = require(metadataFile)
    if (data.contentType === 'chapter') {
      data.number = parseInt(data.number) + 1
      fs.writeFile(metadataFile, JSON.stringify(data), 'utf8', () => null)
    }
  }

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    main(folder)
  }
}
