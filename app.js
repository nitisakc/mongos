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
app.get('/test/:a/:b/:c', function (req, res) {
	let { a, b, c } = req.params;
	res.send({ a, b, c });
});
app.get('/status', function (req, res) {
	console.log('STATUS');
	res.send('OK');
	
});
app.get('/findtest', function (req, res) {
	mgdb.find('portal', 'probsum', { $or: [ {inform: "430376"},{login: "430376"} ] }, (err, docs)=>{
		console.dir(err, docs);
		res.send({ 
			err: err, 
			docs: docs 
		});
	});
});
app.post('/aggregate', function (req, res) {
	console.log('aggregate', req.body);

	let db = req.body.db;
	let coll = req.body.coll;
	let query = req.body.query;
	query = query == undefined ? { } : query;

	console.log(query);
	mgdb.aggregate(db, coll, query, (err, docs)=>{
		console.dir(err, docs);
		res.send({ 
			err: err, 
			docs: docs 
		});
	});
});
app.post('/find', function (req, res) {
	console.log('find', req.body);

	let db = req.body.db;
	let coll = req.body.coll;
	let query = req.body.query;
	query = query == undefined ? { } : query;

	console.log(query);
	mgdb.find(db, coll, query, (err, docs)=>{
		console.dir(err, docs);
		res.send({ 
			err: err, 
			docs: docs 
		});
	});
});
app.post('/insert', function (req, res) {
	console.log('insert', req.body);

	let db = req.body.db;
	let coll = req.body.coll;
	let data = req.body.data;
	data = data == undefined ? { } : data;

	console.log(data);
	mgdb.insert(db, coll, data, (err, result)=>{
		console.dir(err, result);
		res.send({ 
			err: err, 
			result: result 
		});
	});
});
app.post('/updateone', function (req, res) {
	console.log('updateone', req.body);

	let db = req.body.db;
	let coll = req.body.coll;
	let query = req.body.query;
	query = query == undefined ? { } : query;
	let data = req.body.data;
	data = data == undefined ? { } : data;

	console.log(data);
	mgdb.updateOne(db, coll, query, data, (err, result)=>{
		console.dir(err, result);
		res.send({ 
			err: err, 
			result: result 
		});
	});
});

var server = http.createServer(app);
server.listen(port);