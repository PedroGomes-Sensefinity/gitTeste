'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const multiparty = require('multiparty');
const fs = require('fs');
const FormData = require("form-data");

// Handling Constants
const PORT = process.env.PORT || 8081;
const HOST = '0.0.0.0';
const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

// App
const app = express();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

var allowedOrigins = [process.env.SERVICE_REST_ALLOW_CORS_ORIGIN];

app.use(cors());



// Return of logo image specific for current infrastructure
app.get('/api/logo.png', (req, res) => {

  var data = process.env.SERVICE_APP_REST_API_B64_LOGO
  var img = Buffer.from(data, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  res.end(img);

});

app.get('/api/logo.ico', (req, res) => {

  var data = process.env.SERVICE_APP_REST_API_B64_ICO
  var img = Buffer.from(data, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/x-icon',
    'Content-Length': img.length
  });
  res.end(img);

});

app.post('/api/device/upload*',  (req, res) => {

  const pathUrl = req.url.replace('/api/','');

  console.log("processing @upload: " + pathUrl);

  var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {});
  form.on('file', function(name,file) {
    fs.readFile(file.path, 'utf8', function(err, data) {
      if (err) throw err;
      let headerOptions = {
        'version': process.env.SERVICE_APP_REST_API_VERSION,
        'user-agent': req.header('User-Agent'),
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'accept': '*/*'
      }
      if (typeof req.header('Token') !== 'undefined') {
        headerOptions.token = req.header('Token');
      } else if (typeof req.header('authorization') !== 'undefined') {
        headerOptions.authorization = req.header('authorization');
      }

      const form_data = new FormData();
      form_data.append('devices', fs.createReadStream(file.path));
      const request_config = {
        headers: {
          'Token': headerOptions.token,
          'version': process.env.SERVICE_APP_REST_API_VERSION,
          ...form_data.getHeaders()
        }
      };

      axios.post(process.env.SERVICE_APP_REST_API_URL + pathUrl, form_data, request_config)
      .then(function (response) {
        res.set('Content-Type', 'application/json');
        res.status(response.status);
        res.send(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          res.status(error.response.status).end();
        } else {
        }
      });
    });
  });

});

app.post('/api/upload*',  (req, res) => {
    const pathUrl = req.url.replace('/api/','');

    console.log("processing @upload: " + pathUrl);

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {});
    form.on('file', function(name,file) {
        fs.readFile(file.path, 'utf8', function(err, data) {
            if (err) throw err;
            let headerOptions = {
                'version': process.env.SERVICE_APP_REST_API_VERSION,
                'user-agent': req.header('User-Agent'),
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*'
            }
            if (typeof req.header('Token') !== 'undefined') {
                headerOptions.token = req.header('Token');
            } else if (typeof req.header('authorization') !== 'undefined') {
                headerOptions.authorization = req.header('authorization');
            }

            const form_data = new FormData();
            form_data.append('file', fs.createReadStream(file.path));
            const request_config = {
                headers: {
                    'Token': headerOptions.token,
                    'version': process.env.SERVICE_APP_REST_API_VERSION,
                    ...form_data.getHeaders()
                }
            };

            axios.post(process.env.SERVICE_APP_REST_API_URL + pathUrl, form_data, request_config)
                .then(function (response) {
                    res.set('Content-Type', 'application/json');
                    res.status(response.status);
                    res.send(response.data);
                })
                .catch(function (error) {
                    if (error.response) {
                        // console.log(error.response);
                        res.status(error.response.status).end();
                    } else {
                    }
                });
        });
    });
});


// proper encoding for API RESTful pages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API
app.all('/api/*', (req, res) => {

  const pathUrl = req.url.replace('/api/','');

  console.log("processing : " + pathUrl);

  let headerOptionConnection;
  if (typeof req.header('connection') === 'undefined') {
    headerOptionConnection = 'keep-alive';
  } else {
    headerOptionConnection = req.header('connection');
  }

  let headerOptions = {
        'version': process.env.SERVICE_APP_REST_API_VERSION,
        'connection' : headerOptionConnection,
        'user-agent': req.header('User-Agent'),
        'content-type': req.header('Content-Type'),
        'accept': req.header('Accept'),
        'cache-control': req.header('Cache-Control')
  }
  if (typeof req.header('Token') !== 'undefined') {
    headerOptions.token = req.header('Token');
  } else if (typeof req.header('authorization') !== 'undefined') {
    headerOptions.authorization = req.header('authorization');
  }

  let axioData = {
    method: req.method,
    url: process.env.SERVICE_APP_REST_API_URL + pathUrl,
    headers: headerOptions,
    data: req.body
  }

  axios(axioData)
  .then(function (response) {
    res.set('Content-Type', 'application/json');
    res.status(response.status);
    res.send(response.data);
  })
  .catch(function (error) {
    console.log(error);
    if (error.response) {
      res.status(error.response.status).end();
    } else {
      res.status(500).end();
    }
  });

});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
