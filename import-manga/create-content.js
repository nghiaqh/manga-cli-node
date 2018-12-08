const {Author, Genre, Manga, Page, Series} = require('../models');
const { getItemName } = require('../utils/fs');
const logger = require('../utils/logger');

/**
 * Async find or create wrapper for loopback findOrCreate
 * @param {Loopback Persistent Instance} Model
 * @param {object} filter
 * @param {object} data
 * @returns {promise}
 */
async function findOrCreateOne(Model, filter, data) {
  // return new Promise((resolve, reject) => {
  //   const callback = (err, record, created) => {
  //     if (err && err.code === 'ER_DUP_ENTRY') {
  //       findOne(Model, filter).then(resolve);
  //     } else {
  //       reject(err);
  //     }

  //     resolve([record, created]);
  //   };

  //   Model.findOrCreate(filter, data, callback);
  // });
  let instance, created = false;
  try {
    [ instance, created ] = await Model.findOrCreate(filter, data);
  } catch (e) {
    instance = await Model.findOne(filter);
  }
  return [ instance, created ];
}

/**
 * Async find or create wrapper for loopback findOne
 * @param {Loopback persistent instance} Model
 * @param {object} filter
 * @returns {promise}
 */
function findOne(Model, filter) {
  return new Promise((resolve, reject) =>
    Model.findOne(
      filter,
      (err, item) => {
        if (err) reject(err);
        resolve([item, false]);
      })
  )
}

/**
 * Create a Page record
 * @param {string} img image path
 * @param {number} number page number
 * @param {number} mangaId
 * @returns {promise}
 */
function createPage(img, number, mangaId) {
  const data = {
    title: getItemName(img).trim(),
    uri: img.trim(),
    mangaId,
    number,
  };
  const filter = { where: data };
  return findOrCreateOne(Page, filter, data);
}

/**
 * Create multiple Page records
 * @param {array} images
 * @param {Manga} manga
 * @returns {Array} list of promises
 */
function createPages(images, manga) {
  return images.map((img, index) => createPage(img, index + 1, manga.id));
}

/**
 * Create an Author record
 * @param {string} name
 * @returns {Author}
 */
function createAuthor(name) {
  const filter = { where: { name }};
  const data = { name };
  return findOrCreateOne(Author, filter, data);
}

/**
 * Create a Manga record
 * @param {string} title
 * @param {number} authorId
 * @param {string} createdTime
 * @returns {promise}
 */
function createManga(title, authorId, createdTime) {
  const filter = { where: { title, authorId } };
  const data = { title, authorId, created: createdTime };
  return findOrCreateOne(Manga, filter, data);
}

/**
 * Create author, manga and page records
 * @param {string} folderName name of folder
 * @param {string} mtime modified time of folder
 * @param {array} files images path inside folder
 * @param {boolean} newOnly
 * - true to create new content only
 * - false to both create new and update existing records
 * @returns {array} promises
 */
async function createContent(folderName, mtime, files, newOnly) {
  let authorName = folderName.split(',')[0];
  let mangaTitle = folderName.split(`${authorName},`)[1].trim();
  authorName = authorName.trim();

  const [author, isNewAuthor] = await createAuthor(authorName);
  const [manga, isNewManga] = await createManga(mangaTitle, author.id, mtime);

  if (isNewManga) {
    manga.updateAttribute('coverPicture', files[0]);
    manga.updateAttribute('pageCount', files.length);
    manga.save();
  }

  if (newOnly && !isNewManga) return [
    new Promise(resolve => {
      resolve({
        msg: `Skipped: ${mangaTitle} by ${authorName}`,
        isNew: false
      });
    })
  ];

  await Page.destroyAll({ mangaId: manga.id });

  const promises = createPages(files, manga);
  promises.push(
    new Promise(resolve => {
      resolve({
        msg: `New: ${mangaTitle} by ${authorName}`,
        isNew: true
      });
    })
  );

  return promises;
}

module.exports = {
  createPages,
  createAuthor,
  createManga,
  createContent
}
