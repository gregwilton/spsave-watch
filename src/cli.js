#!/usr/bin/env node

const chokidar = require('chokidar');
const yargs = require('yargs');
const utils = require('./utils');

const argv = yargs
  .describe('path', 'Path or glob to files/directory to be watched')
  .describe('config', 'Path to configuration file')
  .describe('siteUrl', 'URL for SharePoint site')
  .describe('folder', 'Folder within the SharePoint site')
  .describe('username', 'Username for SharePoint site')
  .argv;

const defaults = {
  coreOptions: {
    checkin: false
  }
};

utils.loadConfig(argv)
  .then(config => utils.mergeArgs(config, argv))
  .then(config => utils.loadMissingCredentials(config))
  .then(config => utils.promptForMissingArgs(config))
  .then(config => utils.mergeDefaults(defaults, config))
  .then((config) => {
    const watcher = chokidar.watch(config.get('path'), { ignoreInitial: true });

    watcher
      .on('add', path => utils.uploadFile(path, config))
      .on('change', path => utils.uploadFile(path, config))
      .on('error', error => console.error(`Watcher error: ${error}`))
      .on('ready', () => console.log('Watching for changes'));
  })
  .catch(err => console.error(err));
