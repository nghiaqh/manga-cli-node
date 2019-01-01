const items = ['a', 'b', '1.jpg', 'metadata.json']

function readdirSync (path) {
  return path === '/' ? items : []
}

function statSync (input) {
  return input.indexOf('.') >= 0 ? {
    isDirectory: () => false,
    isFile: () => true
  } : {
    isDirectory: () => true,
    isFile: () => false,
    mtime: {
      getTime: () => new Date()
    }
  }
}

module.exports = {
  items,
  readdirSync,
  statSync
}
