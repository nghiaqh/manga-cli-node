const {
  isFolder,
  getFolderItems,
  filterImages
} = require('./lib/fs')

const cache = {}

async function scanFolderContent (folderPath, processFunc, limit = 0) {
  if (!isFolder(folderPath)) return cache

  const {
    files,
    folders
  } = getFolderItems(folderPath)

  const metadataFile = files.filter(file => file.indexOf('metadata.json') >= 0)

  if (metadataFile.length) {
    const images = filterImages(files)
    await processFunc(metadataFile, images, cache)
  }

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    await scanFolderContent(folder, processFunc)
  }
}

module.exports = {
  scanFolderContent
}
