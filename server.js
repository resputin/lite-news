'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());



if(require.main === module) {
  app.listen(8080, function() {
    console.log('Server listening on 8080');
  });
}