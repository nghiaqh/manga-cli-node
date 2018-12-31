const uniq = require('lodash/uniq');
const flatten = require('lodash/flatten');
const {
  createArtist,
  updateArtist,
  createSeries,
  createOneshot,
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

async function createContent (meta, data) {
  const {
    artistStrings,
    containerTitle,
    containerType,
    vol,
    chapter,
    images,
    isOneshot,
    isSeries
  } = meta;

  if (!artistStrings || !containerTitle) return data;

  const artists = await createArtists(artistStrings, data);

  const callback = isOneshot ? createOneshot : createSeries;
  const container = await createContainer(containerTitle, containerType, data, artists, callback);
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

async function createContainer(title, type, data, artists, func) {
  const existing = data.containers.filter(container => container.title === title);
  const toBeCreated = existing.length ? null : title;
  let result = existing[0];

  if (toBeCreated) {
    result = flatten(await func({
      title: title,
      artistId: artists[0].id,
      description: '',
      type: type
    }))
  }

  return result
}



module.exports = {
  createContent
}