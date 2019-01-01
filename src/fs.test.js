const {
  isFolder,
  isFile,
  getFolderItems,
  filterImages,
  getItemName,
  scanFolder
} = require('./fs')

jest.mock('fs')

test('isFolder', () => {
  expect(isFolder('a/b')).toBe(true)
  expect(isFolder('a/b.json')).toBe(false)
})

test('isFile', () => {
  expect(isFile('a/b')).toBe(false)
  expect(isFile('a/b/x.txt')).toBe(true)
})

test('getFolderItems', () => {
  const {
    files,
    folders
  } = getFolderItems('/')
  expect(files).toEqual(['/1.jpg', '/metadata.json'])
  expect(folders).toEqual(['/a', '/b'])
})

test('filterImages', () => {
  expect(filterImages([
    'a.txt',
    'b.png',
    'c.js'
  ])).toEqual(['b.png'])
})

test('getItemName', () => {
  expect(getItemName('/a/b/c')).toEqual('c')
  expect(getItemName('/')).toEqual('')
})

test('scanFolder', () => {
  const result = scanFolder('/', (json, images, cache) => {
    cache.status = 'done'
  })
  result.then(data => expect(data.status).toEqual('done'))
})
