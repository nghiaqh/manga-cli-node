const fs = require('fs')
const path = require('path')
const probe = require('probe-image-size')

/**
 * Return true if input is a folder path
 * @param {String} path a folder path
 */
function isFolder (path) {
  return fs.statSync(path).isDirectory()
}

/**
 * Return true if input is a folder path
 * @param {String} path a folder path
 */
function isFile (path) {
  return fs.statSync(path).isFile()
}

function isNewer (a, b) {
  return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
}

/**
 * Get file and folder names inside a directory
 * Returned data sorts folder by created time.
 *
 * @param {String} folderPath a directory path
 */
function getFolderItems (folderPath) {
  const folders = []
  const files = []

  const items = fs.readdirSync(folderPath)

  items.forEach(item => {
    const itemPath = path.join(folderPath, item)
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      folders.push(itemPath)
    } else if (stat.isFile()) {
      files.push(itemPath)
    }
  })

  return {
    files: files,
    folders: folders.sort(isNewer)
  }
};

/**
 * Return all images file inside a folder
 * @param {String} folder path to a directory
 * @returns {Array} images
 */
function filterImages (files) {
  const imgRe = /.*\.(jpg|jpeg|png|gif|svg)$/
  return files.filter(file => imgRe.exec(file))
    .map((file, index) =>
      probe(fs.createReadStream(file)).then(({
        width,
        height
      }) =>
        ({
          title: getItemName(file),
          number: index + 1,
          width,
          height,
          ratio: width && height ? width / height : null,
          src: file
        })
      )
    )
}

function getItemName (itemPath) {
  return path.parse(itemPath).base.split('/').pop()
}

/**
 * Search for metadata.json and image files inside a folder
 * @param {String} folderPath folder path string
 * @param {Function} processFunc function
 * @param {Object} cache cache object
 * @param {Number} limit limit number of subfolders to read
 * @returns cache object
 */
async function scanFolder (folderPath, processFunc, cache = {}, limit = 0) {
  if (!isFolder(folderPath)) return cache

  const {
    files,
    folders
  } = getFolderItems(folderPath)

  const metadataFile = files.filter(file => file.indexOf('metadata.json') >= 0)

  if (metadataFile.length) {
    const meta = require(metadataFile[0])
    const images = filterImages(files)
    await processFunc(meta, images, cache)
  }

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    await scanFolder(folder, processFunc, cache)
  }

  return cache
}

module.exports = {
  isFolder,
  isFile,
  getFolderItems,
  filterImages,
  getItemName,
  scanFolder
}
