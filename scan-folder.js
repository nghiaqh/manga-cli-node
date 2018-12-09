const {
  isFolder,
  getFolderItems,
  filterImages
} = require('./utils/fs');
const path = require('path');

// /[author] manga title
const containerPattern = /\/\[[^\[^\]^//.]+\][^\[^\]^//.]+/;

// /vol 01; /volume 01
const volPattern = /\/(vol|volume) [0-9]{2,}[^\/.]{0,}/i;

// /chapter 01; /c 01
const chapterPattern = /\/(chapter|c) [0-9]{2,}[^\/.]{0,}/i;

function scanFolder(folderPath, limit = 0, data = {}) {
  if (!isFolder(folderPath)) return data

  const matchContainer = folderPath.match(containerPattern);
  const matchVol = folderPath.match(volPattern);
  const matchChapter = folderPath.match(chapterPattern);

  const container = matchContainer ? matchContainer[0].slice(1) : null;
  const vol = matchVol ? matchVol[0].slice(1) : null;
  const chapter = matchChapter ? matchChapter[0].slice(1) : null;

  const { files, folders } = getFolderItems(folderPath);
  const images = filterImages(files);

  updateData(container, vol, chapter, images, data);

  folders.slice(0, Number(limit) || folders.length)
    .forEach(folder => scanFolder(folder, 0, data));

  return data;
}

/**
 *
 * @param {string} container
 * @param {string} vol
 * @param {string} chapter
 * @param {object} data
 * @return {object} data
 *
 * {
 *   container_id: {
 *     volumes: ['vol 1', 'vol 2'],
 *     chapters: ['chapter 1', 'chapter 2'],
 *     images: [
 *       {name, url, chapter, vol}
 *     ]
 *   },
 *   authors: [a, b, c]
 * }
 */
function updateData(container, vol, chapter, files, data) {
  if (!container) return data

  if (!Object.keys(data).includes(container)) {
    data[container] = {
      volumes: [],
      chapters: [],
      images: []
    };
  }

  const authors = getAuthors(container)
  if (!data.authors) {
    data.authors = authors
  } else {
    authors.forEach(author => data.authors.includes(author) ? '' : data.authors.push(author))
  }

  if(vol && data[container].volumes.indexOf(vol) < 0) {
    data[container].volumes.push(vol);
  }

  if(chapter && data[container].chapters.indexOf(chapter) < 0) {
    data[container].chapters.push(chapter);
  }

  files.forEach(file => {
    data[container].images.push({
      name: path.parse(file).base,
      url: file,
      chapter: chapter,
      vol: vol
    })
  });

  return data;
}

function getAuthors(title) {
  var authorPattern = /\[[^\[^\]^//.]+\]/
  const authors = authorPattern.exec(title)[0].replace(/[\[\]]/g, '')
    .split(',').map(a => a.trim())
  return authors
}

module.exports = {
  scanFolder
};
