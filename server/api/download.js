const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const randomstring = require('randomstring')
const mkdirp = require('mkdirp')
const del = require('del')

const router = require('express').Router()
module.exports = router

const _db = 'const Sequelize = require(\'sequelize\')\n' +
            'const db = new Sequelize(\'postgres://user:pass@example.com:5432/dbname\')\n' +
            'module.exports = db'

router.get('/send/:key', function(req, res, next) {
  let folderPath = path.join(__dirname, 'temp', req.params.key)
  let filePath = path.join(__dirname, 'temp', req.params.key, 'test.zip')
  fs.lstat(filePath, (err, stat) => {
    if (err) {
      next(err)
    } else {
      res.type('application/zip')
          .download(filePath, 'test.zip', err => {
            if (err) next(err)
            console.log(`Downloaded ${filePath}`)
          })

      del([folderPath]).then(paths => {
          console.log(`Deleted files and folders:\n ${paths.join('\n')}`)
      }).catch(next)
    }
  })
})

router.post('/create', function(req, res, next) {
  let key = randomstring.generate()
  let folderPath = path.join(__dirname, 'temp', `${key}`)
  let filePath = path.join(folderPath, 'test.zip')

  mkdirp(folderPath, (err) => {
    if (err) next(err)

    let archive  = archiver('zip')
    let output = fs.createWriteStream(filePath)
    archive.pipe(output)
    archive.append(_db, { name: '_db.js'})    

    archive.finalize((err, bytes) => {
      if (err) next(err)
      console.log(bytes + ' total bytes')
    })
    output.on('close', () => res.send(key))
  })
})