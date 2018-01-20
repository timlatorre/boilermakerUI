const mkdirp = require('mkdirp')

const makeDirectories = (dirPath) => {
  mkdirp(`${dirPath}`, function (err) {
    if (err) console.error(err)
    else console.log("You've been mkdirp-ed!")
  });
}

module.exports = {
  makeDirectories
}