// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const path = require('path');

const assets = require('bankai')(path.join(__dirname, './public/client.js'),{
  js: {
    debug: true
  },
  watch: true,
})

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use('/emoji', express.static('node_modules/twemoji/2/svg'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/bundle.js", function (request, response) {
  return assets.js(request, response).pipe(response)
});

app.get("/*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
