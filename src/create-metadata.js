const fs = require('fs')
const path = require('path')

const {
  isFolder,
  getFolderItems
} = require('./fs')

function createMangaMeta (folder) {
  const folderName = path.parse(folder).base.split('/').pop()
  const pattern = /(\[[^\].]+\]) ([^[.]+)/
  const matches = pattern.exec(folderName)
  console.log(matches)
  if (!matches) return

  let authorName = matches[1].replace('[', '').replace(']', '')
  let mangaTitle = matches[2]
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
  fs.writeFile(path.join(folder, 'metadata.json'), JSON.stringify(data), 'utf8', () => null)
  return true
}

function createVolumeMeta (rootFolder) {
  const metaFile = path.join(rootFolder, 'metadata.json')
  if (!fs.existsSync(metaFile)) return
  const data = require(metaFile)
  const manga = data.title
  const isNSFW = data.isNSFW

  return function createChapterMetaFile (folder) {
    const folderName = path.parse(folder).base.split('/').pop()
    const volNumber = folderName.split('vol')[1] && folderName.split('vol')[1].trim()

    if (!volNumber) return

    const data = {
      contentType: 'volume',
      number: volNumber,
      title: `${manga} - vol ${volNumber}`,
      shortTitle: `vol ${volNumber}`,
      description: '',
      shortDescription: '',
      publishedAt: '',
      isNSFW: isNSFW,
      relation: {
        manga: manga
      }
    }

    fs.writeFile(path.join(folder, 'metadata.json'), JSON.stringify(data), 'utf8', () => null)
  }
}

function createChapterMeta (rootFolder) {
  const metaFile = path.join(rootFolder, 'metadata.json')

  if (!fs.existsSync(metaFile)) {
    console.log('cannot find metadata at ', rootFolder)
    return
  }

  const data = require(metaFile)
  let manga, volNumber
  const publishedAt = data.publishedAt
  const isNSFW = data.isNSFW

  if (data.contentType === 'manga') {
    manga = data.title
  } else if (data.contentType === 'volume') {
    volNumber = data.number
    manga = data.relation.manga
  }

  return function createChapterMetaFile (folder) {
    const folderName = path.parse(folder).base.split('/').pop()
    const pattern = /(c(\d)+)|(chapter (\d)+)/i
    const matches = pattern.exec(folderName)
    let chapterNumber

    if (matches === null) return
    const tmp = matches[0].toLowerCase()
    if (tmp.indexOf('chapter') > -1) {
      chapterNumber = tmp.split('chapter')[1].trim()
    } else {
      chapterNumber = tmp.split('c')[1].trim()
    }

    const data = {
      contentType: 'chapter',
      number: chapterNumber,
      title: `${manga}${volNumber ? ' v' + volNumber : ''} - ${folderName}`,
      shortTitle: `${folderName}`,
      description: '',
      shortDescription: '',
      publishedAt: publishedAt,
      isNSFW,
      relation: {
        manga: manga,
        volume: volNumber
      }
    }

    console.log(data)

    fs.writeFile(path.join(folder, 'metadata.json'), JSON.stringify(data), 'utf8', () => null)

    return true
  }
}

function createMangaMetaFiles (folderPath, limit) {
  if (!isFolder(folderPath)) {
    console.log('folderPath does not exist')
    return
  }

  const result = createMangaMeta(folderPath)
  if (result) return

  const {
    folders
  } = getFolderItems(folderPath)

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    console.log(folder)
    createMangaMeta(folder)
  }
}

function createVolumeMetaFiles (folderPath, limit) {
  if (!isFolder(folderPath)) return

  const {
    folders
  } = getFolderItems(folderPath)
  const operator = createVolumeMeta(folderPath)
  operator(folderPath)

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    console.log(folder)
    operator(folder)
  }
}

function createChapterMetaFiles (folderPath, limit) {
  if (!isFolder(folderPath)) return

  const {
    folders
  } = getFolderItems(folderPath)
  const operator = createChapterMeta(folderPath)

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    const result = operator ? operator(folder) : null
    if (!result) {
      const pattern = /(c(\d)+)|(chapter (\d)+)/
      const matches = pattern.exec(folder)
      if (matches === null) createChapterMetaFiles(folder)
    }
  }
}

module.exports = {
  createMangaMetaFiles,
  createVolumeMetaFiles,
  createChapterMetaFiles
}
