const path = require('path');
const fs = require('fs');

// Generate pages object
const pages = {};

function getEntryFile(entryPaths, allFiles = []) {
  entryPaths.forEach(entryPath => {
    const entries = fs.readdirSync(entryPath).map(entry => path.join(entryPath, entry));
    entries.forEach(entry => {
      if (fs.statSync(entry).isDirectory()) {
        getEntryFile([entry], allFiles); // Recursively fetch files from subdirectories
      } else {
        allFiles.push(entry);
      }
    });
  });
  return allFiles;
}

// Specify both paths in an array
const entryPaths = [
  path.resolve(`src/entry`),
  path.resolve(`src/entry/profiles`) 
];

const chromeName = getEntryFile(entryPaths);

function getFileExtension(filename) {
  const baseName = path.basename(filename);
  return /[.]/.exec(baseName) ? /[^.]+$/.exec(baseName)[0] : undefined;
}

chromeName.forEach((filePath) => {
  const name = path.basename(filePath);
  const fileExtension = getFileExtension(name);
  const fileName = name.replace('.' + fileExtension, '');
  pages[fileName] = {
    entry: filePath, // Adjusted to use the full file path
    template: 'public/index.html',
    filename: `${fileName}.html`
  };
});

console.log(chromeName)

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  pages,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin('copy').use(require('copy-webpack-plugin'), [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.${process.env.NODE_ENV}.json`),
            to: `${path.resolve('dist')}/manifest.json`
          },
          {
            from: path.resolve(`public/`),
            to: `${path.resolve('dist')}/`
          }
        ]
      }
    ]);
    config.optimization.minimize(false); // Prevent minify code to help debug
  },
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`
    },
    devtool: isDevMode ? 'inline-source-map' : false
  },
  css: {
    extract: false // Make sure the css is the same
  }
};
