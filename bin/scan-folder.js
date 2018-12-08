const _ = require('lodash')
const { parseProcessArgs } = require('../utils/cli')
const { scanFolder } = require('../scan-folder')
const fs = require('fs');

const { folderPath, limit } = parseProcessArgs();
const data = scanFolder(folderPath, limit);
console.log(Object.keys(data));

if (folderPath.includes('/Hentai/Oneshot')) {
  fs.writeFile('test-data/h-oneshot.json', JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Wrote data to test-data/h-oneshot.json');
  });
} else if (folderPath.includes('/Hentai/Series')) {
  fs.writeFile('test-data/h-series.json', JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Wrote data to test-data/h-series.json');
  });
} else if (folderPath.includes('/Mangas/Oneshot')) {
  fs.writeFile('test-data/oneshot.json', JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Wrote data to test-data/oneshot.json');
  });
} else if (folderPath.includes('/Mangas/Series')) {
  fs.writeFile('test-data/series.json', JSON.stringify(data), err => {
    if (err) throw err;
    console.log('Wrote data to test-data/series.json');
  });
}