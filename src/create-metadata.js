const fs = require('fs')
const path = require('path')

const {
  isFolder,
  getFolderItems
} = require('./fs')

function createMetadataFiles (folderPath, content, limit) {
  if (!isFolder(folderPath)) return

  let operation
  switch (content) {
    default:
      operation = createMangaMetaFile
  }

  operation(folderPath)

  const {
    folders
  } = getFolderItems(folderPath)

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    console.log(content, folder)
    operation(folder)
  }
}

function createMangaMetaFile (folder) {
  const folderName = path.parse(folder).base.split('/').pop()
  const pattern = /([^,.]+),([^,.]+)/
  const matches = pattern.exec(folderName)
  if (!matches) return

  let authorName = folderName.split(',')[0]
  let mangaTitle = folderName.split(`${authorName},`)[1].trim()
  authorName = authorName.trim()

  const data = {
    contentType: 'manga',
    title: `[${authorName}] ${mangaTitle}`,
    shortTitle: mangaTitle,
    description: '',
    isSeries: false,
    isComplete: true,
    isTankoubou: false,
    isDoujinshi: false,
    isNSFW: true,
    publishedAt: '2015-01-01',
    relation: {
      tags: [],
      parody: [],
      authors: [{
        name: authorName,
        type: 'mangaka'
      }]
    }
  }
  console.log(data)
  fs.writeFile(`${folder}/metadata.json`, JSON.stringify(data), 'utf8', () => null)
}

module.exports = {
  createMetadataFiles
}
