const uniq = require('lodash/uniq');
const flatten = require('lodash/flatten');
const {
  createArtist,
  createSeries,
  createVolume,
  createChapter,
  createImage
} = require('./lib/loopback');


function getArtistType(contentType) {
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

async function createContent (artists, containerTitle, vol, chapter, images, data) {
  if (!artists || !containerTitle) return data;

  const artistObjs = await createArtists(artists, data);
}

async function createArtists(artists, data) {
  let existing = [];
  let toBeCreated = [];
  let result = [];

  uniq(artists).forEach(artist => {
    existing = existing.concat(data.artists.filter(dataArtist => dataArtist.name === artist))
    if (!existing.length) toBeCreated = toBeCreated.concat(artist)
  })

  for (const artist of toBeCreated) {
    const newArtist = flatten(await createArtist({
      name: artist,
      type: getArtistType(data.type),
      biography: '',
      avatar: {},
      oneshots: [],
      series: []
    }));

    result = result.concat(newArtist)
    data.artists = data.artists.concat(newArtist);
  }

  return result.concat(existing);
}

module.exports = {
  createContent
}