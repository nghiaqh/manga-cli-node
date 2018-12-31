const {
  isFolder,
  getFolderItems,
  filterImages
} = require('./lib/fs');
const fs = require('fs');

// /[artist] manga title
const containerPattern = /\/\[[^\[^\]^//.]+\][^\[^\]^//]+/;

// /vol 01; /volume 01
const volPattern = /\/(vol|volume) [0-9]{2,}[^\/.\.]{0,}/i;

// /chapter 01; /c 01
const chapterPattern = /\/(chapter|c) [0-9]{2,}[^\/.\.]{0,}/i;

async function scanFolder(folderPath, operation, limit = 0, result = {}) {
  if (!isFolder(folderPath)) return result
  result.artists = result.artists || []
  result.containers = result.containers || []

  const meta = setMetadata(folderPath);
  await operation(meta, result);

  for (const folder of meta.folders.slice(0, Number(limit) || meta.folders.length)) {
    await scanFolder(folder, operation, 0, result);
  }

  return result;
}

function parseContainer(container) {
  if (!container) return {}

  const artistPattern = /\[[^\[^\]^//.]+\]/
  const result = artistPattern.exec(container)[0]
  const artists = result
    .replace(/[\[\]]/g, '')
    .split(',').map(a => a.trim())
  const containerTitle = container.replace(artistPattern, '').trim()

  return {
    artists,
    containerTitle
  }
}

function setMetadata(folderPath) {
  const meta = {};
  folderPath.match('/Oneshot/i') && (meta.isOneshot = true);
  folderPath.match('/Series/i') && (meta.isSeries = true);

  const matchContainer = folderPath.match(containerPattern);
  const matchVol = folderPath.match(volPattern);
  const matchChapter = folderPath.match(chapterPattern);

  const container = matchContainer ? matchContainer[0].slice(1) : null;
  meta.vol = matchVol ? matchVol[0].slice(1) : null;
  meta.chapter = matchChapter ? matchChapter[0].slice(1) : null;

  const { files, folders } = getFolderItems(folderPath);
  const json = files.filter(file => file.indexOf('metadata.json') >= 0);

  if (json.length) {
    const jsContent = JSON.parse(fs.readFileSync(json[0]));
    meta.containerType = jsContent.type;
    meta.containerTags = jsContent.tags;
  }

  meta.images = filterImages(files);
  meta.folders = folders;
  const { artists, containerTitle } = parseContainer(container);

  meta.artistStrings = artists;
  meta.containerTitle = containerTitle;

  return meta;
}

module.exports = {
  scanFolder,
  parseContainer
};
