'use strict';

const path = require('path');
const express = require('express');

const app = express();

app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/api/trucks', function(req, res) {
    res.json([]);
});

app.listen(3000, function() {
    console.log('Express server listening on port 3000.');
});
