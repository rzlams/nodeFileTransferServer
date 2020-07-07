// TODOS:
// BUG: en firefox mobile no se puede cargar multiples archivos en el input file
// Subir con un formdata
// BUG: can't download files whose name contain on of these : # % ?
// posibles soluciones, escape chars o encerrar entre {} como las queries de graphql

const appRoot = require('app-root-path'); // esto se sustituye con TypeScript
const morgan = require('morgan');
const { logger } = require('./libs/winston')(appRoot);

const express = require('express');
const app = express();
const path = require('path');
const { readdirSync } = require('fs');

//libs
const upload = require('./libs/multerStorage');
const localIP = require('./libs/getCurrentIP')();
const getDirContent = require('./libs/getDirContent')(readdirSync);

const port = 5555;
let previewPath = '';
let files = [];
let dirs = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/favicon.ico', (req, res, next) => {
  res.status(204);
  logger.log('warn', { label: 'algodon', message: req.path });
  // logger.info('hello', { message: 'world' });
});

app.get('/upload', (req, res, next) => {
  res.render('upload');
});

app.post('/upload', upload.any(), (req, res, next) => {
  res.redirect('/upload');
});

app.get('/:path?', (req, res, next) => {
  let currentPath = '';

  if(req.params.path){
    if(req.params.path === 'back'){
      if(previewPath.split('/').length >= 3){
        const end = previewPath.lastIndexOf('/');
        currentPath = previewPath.substring(0, end);
      } else {
        currentPath = '/';
      }
    } else {
      currentPath = `${previewPath}/${req.params.path}`;
    }
  } else {
    currentPath = '/';
  }

  if(files.indexOf(req.params.path) >= 0){
    res.download(currentPath);
    return;
  }

  previewPath = currentPath === '/' ? '' : currentPath;
  files = getDirContent(currentPath).files;
  dirs = getDirContent(currentPath).dirs;
  res.render('index', { files, dirs });

});


app.listen(port, () => {
  console.log(`Server listening on ${localIP}:${port}`);
});
