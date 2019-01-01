const get = require('lodash/get')
const {
  patchOrCreateWithCache,
  patch
} = require('./loopback')

async function createContent (meta, images, cache = {}) {
  cache.artists = cache.artists || []
  cache.mangas = cache.mangas || []
  cache.volumes = cache.volumes || []
  cache.chapters = cache.chapters || []

  switch (meta.contentType) {
    case 'manga':
      await processManga(meta, cache)
      break
    case 'volume':
      await processVolume(meta, cache)
      break
    case 'chapter':
      await processChapter(meta, cache)
      break
    default:
      break
  }

  console.log('\n')
}

async function processManga (meta, cache) {
  const artists = await patchOrCreateWithCache(meta.relation.authors, 'artists', 'name', cache)

  console.info('Artist created: ', artists)

  if (!artists.length) return

  const manga = {
    title: meta.title,
    shortTitle: meta.shortTitle || meta.title,
    description: meta.description,
    shortDescription: meta.shortDescription,
    isSeries: meta.isSeries,
    isComplete: meta.isComplete,
    isTankoubou: meta.isTankoubou,
    isDoujinshi: meta.isDoujinshi,
    isNSFW: meta.isNSFW,
    publishedAt: new Date(meta.publishedAt),
    artistId: artists[0].id
  }

  await patchOrCreateWithCache([manga], 'mangas', 'title', cache)

  console.info('Manga created: ', manga.title)

  // a single story
  if (!manga.isSeries && !manga.isTankoubou) {
    await processChapter({
      title: meta.title,
      shortTitle: meta.shortTitle || meta.title,
      description: meta.description,
      shortDescription: meta.shortDescription,
      number: 0,
      publishedAt: new Date(meta.publishedAt),
      relation: {
        manga: manga.title
      }
    }, cache)
  }
}

async function processVolume (meta, cache) {
  const mangaTitle = get(meta, 'relation.manga')
  if (!mangaTitle) return

  const manga = get(cache.mangas.filter(cachedManga => cachedManga.title === mangaTitle), '[0]')

  if (!manga) {
    console.error('Fail to find manga in cache: ', mangaTitle)
    return
  }

  const volume = {
    title: meta.title,
    shortTitle: meta.shortTitle || meta.title,
    description: meta.description,
    shortDescription: meta.shortDescription,
    number: meta.number,
    publishedAt: new Date(meta.publishedAt),
    mangaId: manga.id
  }

  await patchOrCreateWithCache([volume], 'volumes', 'title', cache)
  console.info('Volume created: ', volume.title)
}

async function processChapter (meta, cache) {
  // get related manga
  const mangaTitle = get(meta, 'relation.manga')
  if (!mangaTitle) return

  const manga = get(cache.mangas.filter(cachedManga => cachedManga.title === mangaTitle), '[0]')

  if (!manga) {
    console.error('Fail to find manga in cache: ', mangaTitle)
    return
  }

  // get related volume
  const volumeNumber = get(meta, 'relation.volume')

  let volume = {
    id: null,
    publishedAt: null
  }
  if (volumeNumber) {
    const volumeTitle = `${mangaTitle} - vol ${volumeNumber}`
    volume = get(cache.volumes.filter(cachedVol => cachedVol.title === volumeTitle), '[0]')
  }

  // chapter data
  const chapter = {
    title: meta.title,
    shortTitle: meta.shortTitle || meta.title,
    description: meta.description,
    shortDescription: meta.shortDescription,
    number: meta.number,
    publishedAt: new Date(meta.publishedAt || volume.publishedAt || manga.publishedAt),
    mangaId: manga.id
  }

  if (volume && volume.id) chapter.volumeId = volume.id

  await patchOrCreateWithCache([chapter], 'chapters', 'title', cache)
  console.info('Chapter created: ', chapter.title)

  manga.modifiedAt = new Date()
  await patch('mangas', manga)
}

module.exports = {
  createContent
}
