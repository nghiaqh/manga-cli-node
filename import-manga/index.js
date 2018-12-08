const flatten = require('lodash/flatten');
const { printHeader, askQuestions, handleError, formatLapse } = require('../utils/cli');
const logger = require('../utils/logger');
const scanFolder = require('./scan-folder');

let startTime;

function importMangaCli() {
  printHeader('Import mangas');
  main();
}

async function main() {
  const { folder, start, limit, newOnly } = await askQuestions();
  startTime = new Date();

  let promises = scanFolder(folder, start, limit, newOnly);
  promises = Array.isArray(promises) ? flatten(promises) : [promises];

  Promise.all(promises)
    .then(printResult)
    .then(main)
    .catch(handleError);
}

function printResult(results) {
  const endTime = new Date();
  const added = results.reduce((count, item) =>
    count = item ? count + 1: count, 0);
  const skipped = results.length - added;

  const addedTxt = `${added} ${added > 1 ? 'mangas' : 'manga'} added.`;
  const skippedTxt = `${skipped} ${skipped > 1 ? 'mangas' : 'manga'} skipped.`;
  const stats = `${added ? addedTxt : ''} ${skipped ? skippedTxt : ''}`.trim();
  const timeLapse = formatLapse(endTime - startTime);
  const text = `FINISHED: ${stats} Time taken: ${timeLapse}`;

  console.log('----------------------------------------------------------------\
----------------');
  logger.info(text);
  console.log('----------------------------------------------------------------\
----------------');
}

module.exports = importMangaCli;
