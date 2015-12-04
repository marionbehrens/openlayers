var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8000;
var fs = require('fs');

// routes will go here

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));
app.use('/app', express.static(path.join(__dirname + '/app')));

// app.use(express.static('app'));
// app.use('/app', express.static('app'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/metro.html'));
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/newFeature', function(req, res) {
  console.log(req.body);
  console.log('Writing content to ' + req.body.file + '...');
  fs.writeFile(req.body.file, req.body.content, function (err) {
    if (err) return console.log(err);
  });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end('{"success" : "Updated Successfully", "status" : 200}');
  // res.json({"done":"yes"});
  //OR res.render('account');
});

//  "start": "http-server -a 0.0.0.0 -p 8000",

