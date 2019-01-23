const {
  parseProcessArgs
} = require('../src/cli')
const {
  scanFolder
} = require('../src/fs')
const {
  createContent
} = require('../src/create-content')

const {
  folderPath,
  limit
} = parseProcessArgs()

/**
 * Scan folders and create database record
 *
 * Usage: API=<api base url> node bin/scan-folder.js <folder-path> -l <limit number of directories>
 *
 * Example: API=http://192.168.0.2:8181/api node bin/scan-folder.js /mnt/c/home/h
 */
scanFolder(folderPath, createContent, {}, limit)
