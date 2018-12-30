const uniq = require('lodash/uniq');
const flatten = require('lodash/flatten');
const {
  createArtist,
  createSeries,
  createVolume,
  createChapter,
  createImage
} = require('./lib/loopback');


function getAuthorType(contentType) {
  switch (contentType) {
    case 'manga':
      return 'Mangaka';
    case 'illustration':
      return 'Illustrator';
    case 'comic':
      return 'Comics artist';
    default:
      return 'Mangaka';
  }
}

async function createContent (authors, containerTitle, vol, chapter, images, data) {
  if (!authors || !containerTitle) return data;

  const authorObjs = await createAuthors(authors, data);
}

async function createAuthors(authors, data) {
  let existing = [];
  let toBeCreated = [];
  let result = [];

  uniq(authors).forEach(author => {
    existing = existing.concat(data.authors.filter(dataAuthor => dataAuthor.name === author))
    if (!existing.length) toBeCreated = toBeCreated.concat(author)
  })

  for (const author of toBeCreated) {
    const newAuthor = flatten(await createArtist({
      name: author,
      type: getAuthorType(data.type),
      biography: '',
      avatar: {},
      oneshots: [],
      series: []
    }));

    result = result.concat(newAuthor)
    data.authors = data.authors.concat(newAuthor);
  }

  return result.concat(existing);
}

module.exports = {
  createContent
}