const {
  isFolder,
  getFolderItems,
  filterImages
} = require('./lib/fs');

// /[author] manga title
const containerPattern = /\/\[[^\[^\]^//.]+\][^\[^\]^//]+/;

// /vol 01; /volume 01
const volPattern = /\/(vol|volume) [0-9]{2,}[^\/.\.]{0,}/i;

// /chapter 01; /c 01
const chapterPattern = /\/(chapter|c) [0-9]{2,}[^\/.\.]{0,}/i;

async function scanFolder(folderPath, operation, limit = 0, result = {}) {
  if (!isFolder(folderPath)) return result
  result.authors = result.authors || []
  result.containers = result.containers || []

  const matchContainer = folderPath.match(containerPattern);
  const matchVol = folderPath.match(volPattern);
  const matchChapter = folderPath.match(chapterPattern);

  const container = matchContainer ? matchContainer[0].slice(1) : null;
  const vol = matchVol ? matchVol[0].slice(1) : null;
  const chapter = matchChapter ? matchChapter[0].slice(1) : null;

  const { files, folders } = getFolderItems(folderPath);
  const images = filterImages(files);

  const { authors, containerTitle } = parseContainer(container);
  await operation(authors, containerTitle, vol, chapter, images, result);

  for (const folder of folders.slice(0, Number(limit) || folders.length)) {
    await scanFolder(folder, operation, 0, result);
  }

  return result;
}

function parseContainer(container) {
  if (!container) return {}

  const authorPattern = /\[[^\[^\]^//.]+\]/
  const result = authorPattern.exec(container)[0]
  const authors = result
    .replace(/[\[\]]/g, '')
    .split(',').map(a => a.trim())
  const containerTitle = container.replace(authorPattern, '')

  return {
    authors,
    containerTitle
  }
}

module.exports = {
  scanFolder,
  parseContainer
};
