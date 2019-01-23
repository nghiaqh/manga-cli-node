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

const {
  folders
} = getFolderItems(folderPath)

for (const folder of folders.slice(0, Number(limit) || folders.length)) {
  console.log(folder)
  const folderName = path.parse(folder).base.split('/').pop()
  const pattern = /([^,.]+),([^,.]+)/
  const matches = pattern.exec(folderName)
  if (!matches) continue

  let authorName = folderName.split(',')[0]
  let mangaTitle = folderName.split(`${authorName},`)[1].trim()
  authorName = authorName.trim()

  const newName = `[${authorName}] ${mangaTitle}`
  const newPath = folder.replace(folderName, newName)

  fs.renameSync(folder, newPath)
}
