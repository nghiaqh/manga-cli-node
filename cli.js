const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { isFolder } = require('./fs');
const logger = require('./logger');

/**
 * Print header text to console
 * @param {string} title e.g 'Content importing'
 * @param {string} color e.g yellow
 * @param {object} options figlet options
 * @returns {null}
 */
function printHeader(title = 'Content importing', color = 'yellow', options = {}) {
  const header = figlet.textSync(title, options);
  console.log(chalk[color](header));
}

/**
 * Enquire inputs for
 */
function askQuestions() {
  const questions = [
    {
      name: 'folder',
      type: 'input',
      message: 'Folder:',
      default: '/mnt/d/h',
      validate: (value) => isFolder(value ? value.trim() : value) ? true : 'Enter a valid folder path',
    },
    {
      name: 'start',
      type: 'input',
      message: 'Starting index',
      default: 0,
      validate: (value) => {
        const isValid = /^\+?([0-9]+)$/.test(value ? value.trim() : value);
        return isValid ? true : 'Enter a positive integer';
      },
    },
    {
      name: 'limit',
      type: 'input',
      message: 'Max import',
      default: '20',
      validate: (value) => {
        const isValid = /^[+-]?([0-9]+)$/.test(value ? value.trim() : value);
        return isValid ? true : 'Enter an integer';
      },
    },
    {
      name: 'newOnly',
      type: 'confirm',
      message: 'Skip imported folder?',
      default: true,
    }
  ];

  return inquirer.prompt(questions);
}

/**
 * Log error
 * @param {Error} err
 */
function handleError(err) {
  const { message, stack } = err || {};
  logger.error({
    message,
    stack
  });
  process.exit(1);
}

function formatLapse(millisec) {
  let seconds = (millisec / 1000).toFixed(2);
  let minutes = Math.floor(seconds / 60);
  let hours = 0;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = (hours >= 1) ? hours : '0' + hours;
    minutes = minutes - (hours * 60);
    minutes = minutes ? minutes : '0' + minutes;
  }

  seconds = Math.round(seconds % 60);
  seconds = seconds ? seconds : '0' + seconds;
  return hours + ':' + minutes + ':' + seconds;
}

module.exports = {
  printHeader,
  askQuestions,
  handleError,
  formatLapse
}
