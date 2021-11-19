'use strict';

const express = require('express');

const app = express();

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);
