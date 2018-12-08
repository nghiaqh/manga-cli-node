const { scanFolder } = require('./scan-folder');
const fs = require('fs');

// REPL
const testSeries = '/mnt/c/Users/Nathan Quach/Mangas/Series/';

const series = scanFolder(testSeries);

fs.writeFile('test-data/series.json', JSON.stringify(series), err => {
  if (err) throw err;
});