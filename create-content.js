const {
  createArtist,
  createSeries,
  createVolume,
  createChapter,
  createImage
} = require('./lib/strapi')

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

function createContent (authors, containerTitle, vol, chapter, images, data ) {
  console.log()
  if (!authors || !containerTitle) return data

  const a = authors.map(author => {
    createArtist({
      name: author,
      type: getAuthorType(data.type)
    })
  })

  console.log('Arist result: ', a)
}

module.exports = {
  createContent
}