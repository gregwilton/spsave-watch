const expect = require('chai').expect;
const Immutable = require('immutable');
const utils = require('../src/utils');

describe('[mergeArgs]', () => {
  const config = Immutable.fromJS({
    path: ['./src', './test'],
    coreOptions: {
      siteUrl: 'https://sp.com',
      checkin: false
    },
    credentials: {
      username: 'me',
      password: '123'
    },
    fileOptions: {
      folder: 'SiteAssets'
    }
  });

  it('Should give precedence to "path" from argv', () => {
    const path = ['./a', './b'];
    const argv = { path };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.path).to.deep.equal(path);
  });

  it('Should add a path property if one exists in argv but not config', () => {
    const path = ['./a', './b'];
    const argv = { path };
    const result = utils.mergeArgs(Immutable.Map(), argv).toJS();

    expect(result.path).to.deep.equal(path);
  });

  it('Should store single paths as an array one item', () => {
    const path = './a';
    const argv = { path };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.path).to.deep.equal([path]);
  });

  it('Should give precedence to "siteUrl" from argv', () => {
    const siteUrl = 'https://bbb.com';
    const argv = { siteUrl };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.coreOptions.siteUrl).to.equal(siteUrl);
  });

  it('Should add a siteUrl property if one exists in argv but not config', () => {
    const siteUrl = 'https://bbb.com';
    const argv = { siteUrl };
    const result = utils.mergeArgs(Immutable.Map(), argv).toJS();

    expect(result.coreOptions.siteUrl).to.equal(siteUrl);
  });

  it('Should give precedence to "folder" from argv', () => {
    const folder = 'Documents';
    const argv = { folder };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.fileOptions.folder).to.equal(folder);
  });

  it('Should add a folder property if one exists in argv but not config', () => {
    const folder = 'Documents';
    const argv = { folder };
    const result = utils.mergeArgs(Immutable.Map(), argv).toJS();

    expect(result.fileOptions.folder).to.equal(folder);
  });

  it('Should give precedence to "username" from argv', () => {
    const username = 'other';
    const argv = { username };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.credentials.username).to.equal(username);
  });

  it('Should add a username property if one exists in argv but not config', () => {
    const username = 'other';
    const argv = { username };
    const result = utils.mergeArgs(Immutable.Map(), argv).toJS();

    expect(result.credentials.username).to.equal(username);
  });

  it('Should remove the password property from config when username exists in argv', () => {
    const username = 'other';
    const argv = { username };
    const result = utils.mergeArgs(config, argv).toJS();

    expect(result.credentials).to.deep.equal({ username });
  });
});
