# Watch files and upload them to SharePoint

Provide a command line interface to watch files and upload them to SharePoint.
The upload process is managed by the [spsave](https://github.com/s-KaiNet/spsave)
module. Most configuration options simply pass through to spsave.

## Caveat

This tool will flatten the directory structure when files are uploaded. This
limitation was acceptable as the expected use-cases only include watching a
small number of files. More advanced build process should look
[gulp-spsave](https://github.com/s-KaiNet/gulp-spsave).

## Installation

```
npm install git+https://github.com/gregwilton/spsave-watch.git --global
```

## Example usage

Specify everything through a configuration file:

```
spsave-watch --config ./config.json
```

Combine command line arguments with a configuration file:

```
spsave-watch --path ./src --path ./test --config ./config.json
```


## Configuration

All properties listed in the example configuration file below are required but
can be specified in multiple ways. The following algorithm will be used to
locate the values.

1. Load the configuration JSON file (is the path was supplied as an argument).
2. Override any configuration values with the values supplied by the command
   line arguments.
3. If no credentials have been supplied, look for a `credentials.json` in the
   user's home directory.
4. Prompt the user for any values that are still missing.
5. Apply any default values that have not already been set.

### Command line arguments

Argument | Description
---------| ----------------------------------------------
path     | Path or glob to files/directory to be watched
config   | Path to configuration file
siteUrl  | URL for SharePoint site
folder   | Folder within the SharePoint site
username | Username for SharePoint site

### Configuration file format

```json
{
  "path": ["./src1", "./src2"],
  "coreOptions": {
    "siteUrl": "https://user.sharepoint.com"
  },
  "credentials": {
    "username": "user@useronmicrosoft.com",
    "password": "1234"
  },
  "fileOptions": {
    "folder": "SiteAssets"
  }
}
```

The coreOptions object is passed directly to `spsave` and can include any valid
value accepted by that module.

### Credentials file

Credentials can be stored separately by creating a `credentials.json` file at
the root of the user's home directory.

```json
{
  "credentials": {
    "username": "user@useronmicrosoft.com",
    "password": "1234"
  }
}
```

### Default values

```json
{
  "coreOptions": {
    "checkin": false
  }
}
```

The `checkin` property is set to false because I usually checkout the first and
leave them checked out while testing the changes.
