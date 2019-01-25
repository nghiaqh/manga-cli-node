const {
  parseProcessArgs
} = require('../src/cli')
const {
  createMangaMetaFiles,
  createVolumeMetaFiles,
  createChapterMetaFiles
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
switch (type) {
  case 'manga':
    createMangaMetaFiles(folderPath, limit)
    break
  case 'volume':
    createVolumeMetaFiles(folderPath, limit)
    break
  case 'chapter':
    createChapterMetaFiles(folderPath, limit)
    break
}
