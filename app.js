const express = require('express');
const path = require('path');
const mgdb = require('./mgdb');
const http = require('http');
const bodyParser = require('body-parser');

let app = express();
const port = 3310;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/status', function (req, res) {
	res.send('OK');
});
app.post('/find', function (req, res) {
	console.log(req.body);

	var db = req.body.db;
	var coll = req.body.coll;
	var query = req.body.query;
	query = query == undefined ? { } : query;

	console.log(query);
	mgdb.find(db, coll, query, (err, docs)=>{
		console.dir(err, docs);
		res.send({ 
			err: err, 
			docs: docs 
		});
	});
})

var server = http.createServer(app);
server.listen(port);

// mgdb.find('portal', 'probsum', {}, (err, docs)=>{
// 		console.dir({ 
// 			err: err, 
// 			docs: docs 
// 		});
// 	});