const _ = require('lodash')
const { parseProcessArgs } = require('../lib/cli')
const { scanFolder } = require('../scan-folder')
const { createContent } = require('../create-content')

const { folderPath, limit, type } = parseProcessArgs();
scanFolder(folderPath, createContent, limit, { type: type || 'manga' });