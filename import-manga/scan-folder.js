const fs = require('fs');
const {
  getFolderItems,
  filterImages,
  validateItemName,
  getItemName
} = require('../fs');
const logger = require('../logger');
const { createContent } = require('./create-content');

function isMangaFolder(folder) {
  const pattern = /([^,.]+),([^,.]+)/;
  return validateItemName(folder, pattern);
}

/**
 * Recursively scan and import data from folder name and its files.
 * @param {String} folder path to a directory
 * @param {Integer} start sub-folder index, starting index
 * @param {Integer} limit sub-folder index, upper limit
 * @param {Boolean} newOnly true to only import new content
 * @returns {(Promise|Array)} promise or list or promises
 */
function scanFolder(folder, start = 0, limit = 0, newOnly = true) {
  logger.info(`Scanning ${folder}`);

  const { folders, files } = getFolderItems(folder);
  const toBeImported = folders.slice(Number(start) || 0, Number(limit) || folders.length);
  const images = filterImages(files);

  if (isMangaFolder(folder) && images.length) {
    return importData(folder, images, newOnly);
  }

  return toBeImported.map(folder => scanFolder(folder, 0, 0, newOnly))
}

/**
 * Process folder and its content, create data.
 * @param {string} folder folder path
 * @param {array} images list of image file paths
 * @param {boolean} newOnly true to import only new folder, false to import every thing
 * @returns {promise}
 */
function importData(folder, images, newOnly) {
  const mtime = fs.statSync(folder).mtime;
  const name = getItemName(folder);

  return createContent(name, mtime, images, newOnly)
    .then(promises => Promise.all(promises))
    .then(printResult);
}

/**
 * Print a folder import status and pass promise to next handler
 * @param {object} result {msg: text, isNew: boolean}
 * @returns {promise}
 */
function printResult(result) {
  if (!result) return new Promise(resolve => resolve(false));

  const { msg, isNew } = result[result.length - 1];
  logger.info(`${msg} (${result.length === 1 ? 0 : result.length - 2}p)`);

  return new Promise(resolve => resolve(isNew));
}

module.exports = scanFolder;
