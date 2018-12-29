const fs = require('fs');
const path = require('path');

/**
 * Return true if input is a folder path
 * @param {String} path a folder path
 */
function isFolder(path) {
  return path.length && fs.statSync(path).isDirectory();
}

/**
 * Return true if input is a folder path
 * @param {String} path a folder path
 */
function isFile(path) {
  return path.length && fs.statSync(path).isFile();
}

function isNewer(a, b) {
  return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
}

/**
 * Get file and folder names inside a directory
 * Returned data sorts folder by created time.
 *
 * @param {String} folderPath a directory path
 */
function getFolderItems(folderPath) {
  const folders = [];
  const files = [];

  const items = fs.readdirSync(folderPath);

  items.forEach(item => {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      folders.push(itemPath);
    } else if (stat.isFile()) {
      files.push(itemPath);
    }
  });

  return {
    files: files,
    folders: folders.sort(isNewer),
  };
};

/**
 * Return all images file inside a folder
 * @param {String} folder path to a directory
 * @returns {Array} images
 */
function filterImages(files) {
  const imgRe = /.*\.(jpg|jpeg|png|gif|svg)$/;
  return files.filter(file => imgRe.exec(file));
}

function getItemName(itemPath) {
  return path.parse(itemPath).base.split('/').pop();
}

/**
 * Check if a folder/file matches with an input pattern
 * @param {string} path folder/file path
 * @param {regex} pattern a regular expression
 * @returns {boolean} true if folder name matches the pattern
 */
function validateItemName(itemPath, pattern) {
  try {
    const name = getItemName(itemPath);
    const matches = pattern.exec(name);
    return matches !== null;
  } catch (e) {
    return false;
  }
}

module.exports = {
  isFolder,
  isFile,
  getFolderItems,
  filterImages,
  getItemName,
  validateItemName
};
