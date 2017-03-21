const fs = require('fs-extra-promise');
const Immutable = require('immutable');
const moment = require('moment');
const path = require('path');
const os = require('os');
const prompt = require('prompt');
const spsave = require('spsave').spsave;

function loadConfig(argv) {
  if (argv.config) {
    return fs.readJsonAsync(argv.config).then((config) => {
      return Immutable.fromJS(config);
    });
  }

  return Promise.resolve(Immutable.Map());
}

function mergeArgs(config, argv) {
  return config.withMutations((map) => {
    if (argv.path) {
      const value = typeof argv.path === 'string' ? [argv.path] : argv.path;
      map.set('path', Immutable.fromJS(value));
    }

    if (argv.siteUrl) {
      map.setIn(['coreOptions', 'siteUrl'], argv.siteUrl);
    }

    if (argv.folder) {
      map.setIn(['fileOptions', 'folder'], argv.folder);
    }

    if (argv.username) {
      // Replace the entire credentials property to force a password prompt.
      map.set('credentials', Immutable.Map({ username: argv.username }));
    }
  });
}

function loadMissingCredentials(config) {
  if (!config.has('credentials')) {
    const configFile = path.resolve(os.homedir(), 'credentials.json');

    return fs.readJsonAsync(configFile)
      .then((credentials) => {
        return config.set('credentials', Immutable.fromJS(credentials));
      })
      .catch(() => {
        // Assume the file doesn't exist and just return original.
        return config;
      });
  }

  return Promise.resolve(config);
}

function mergePromptResults(config, result) {
  return config.withMutations((map) => {
    if (result.path) {
      map.set('path', Immutable.fromJS([result.path]));
    }

    if (result.siteUrl) {
      map.setIn(['coreOptions', 'siteUrl'], result.siteUrl);
    }

    if (result.folder) {
      map.setIn(['fileOptions', 'folder'], result.folder);
    }

    if (result.username) {
      map.setIn(['credentials', 'username'], result.username);
    }

    if (result.password) {
      map.setIn(['credentials', 'password'], result.password);
    }
  });
}

function promptForMissingArgs(config) {
  const fields = {
    path: {
      name: 'path',
      description: 'Path',
      required: true
    },
    siteUrl: {
      name: 'siteUrl',
      description: 'Site URL',
      required: true
    },
    folder: {
      name: 'folder',
      description: 'Folder',
      required: true
    },
    username: {
      name: 'username',
      description: 'Username',
      required: true
    },
    password: {
      name: 'password',
      description: 'Password',
      hidden: true,
      replace: '*',
      required: true
    }
  };
  const missingFields = [];

  if (!config.has('path')) {
    missingFields.push(fields.path);
  }

  if (!config.hasIn(['coreOptions', 'siteUrl'])) {
    missingFields.push(fields.siteUrl);
  }

  if (!config.hasIn(['fileOptions', 'folder'])) {
    missingFields.push(fields.folder);
  }

  if (!config.hasIn(['credentials', 'username'])) {
    missingFields.push(fields.username);
  }

  if (!config.hasIn(['credentials', 'password'])) {
    missingFields.push(fields.password);
  }

  if (missingFields.length !== 0) {
    return new Promise((resolve, reject) => {
      prompt.start();
      prompt.get(missingFields, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(mergePromptResults(config, result));
      });
    });
  }

  return Promise.resolve(config);
}

function mergeDefaults(defaults, config) {
  return Immutable.fromJS(defaults).mergeDeep(config);
}

function log(message) {
  const time = moment().format('HH:mm:ss');
  console.log('[%s] %s', time, message);
}

function uploadFile(filePath, config, retryIfEmpty = true) {
  const { coreOptions, credentials, fileOptions } = config.toJS();

  log(`Uploading: ${filePath}`);

  fs.readFileAsync(filePath)
    .then((contents) => {
      if (contents.length > 0) {
        fileOptions.fileContent = contents;
        fileOptions.fileName = path.basename(filePath);

        return spsave(coreOptions, credentials, fileOptions);
      }

      if (retryIfEmpty) {
        log('File was empty; will retry after delay');
        setTimeout(() => uploadFile(filePath, config, false), 1000);
      } else {
        log('File was empty; ignoring');
      }

      return Promise.resolve();
    })
    .catch(err => console.error(err));
}

module.exports = {
  loadConfig,
  mergeArgs,
  loadMissingCredentials,
  promptForMissingArgs,
  mergeDefaults,
  uploadFile
};
