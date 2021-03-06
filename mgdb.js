
var pjson = require('./package.json');
//const url = "mongodb://portal:1q2w3e4r@192.168.1.7:27017,192.168.1.5:27017,192.168.55.44:27017/portal?authSource=admin&replicaSet=rs0&slaveOk=true&readPreference=secondaryPreferred";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


const connect = function(dbName, callback, i){

	MongoClient.connect(pjson.connStr, { useNewUrlParser: true }).then((client) => {
		const db = client.db(dbName);
		callback(db, client);
	}).catch((err) => {
	    console.log("Not Connected to Database ERROR! ", err);
	    if(!i){ i = 1; }
	    if(i && i < 3){
		    setTimeout(function(){
		    	connect(dbName, callback, i++);
		    },3000);
		}
	});
}

module.exports = {
	find: function(dbName, collection, query, callback){
		try {
			connect(dbName, function(db, client){
				const coll = db.collection(collection);
				coll.find(query).toArray(function(err, docs){
					assert.equal(err, null);
					//console.dir(docs);
					client.close();
					callback(err, docs);
				});
			});
		} catch (err) {
			callback(err, null);
		}
	},
	findOne: function(dbName, collection, query, callback){
		try {
			connect(dbName, function(db, client){
				const coll = db.collection(collection);
				coll.findOne(query, function(err, docs) {
					assert.equal(err, null);
					//console.dir(docs);
					callback(err, docs);
				});
			});
		} catch (err) {
			callback(err, null);
		}
	},
	updateOne: function(dbName, collection, query, data, callback){
		try {
			connect(dbName, function(db, client){
				db.collection(collection).updateOne(query, data, {upsert: false})//{$set: set }
		        .then((obj) => {
		        	//console.log('Updated - ' + obj);
					client.close();
		        	callback(null, obj);
		        })
		        .catch((err) => {
		        	//console.log('Error: ' + err);
					client.close();
		        	callback(err);
		      	});
		  	});
		} catch (err) {
			callback(err, null);
		}
	},
	upsert: function(dbName, collection, query, data, callback){
		try {
			connect(dbName, function(db, client){
				db.collection(collection).updateOne(query, data, {upsert: true})//{$set: set }
		        .then((obj) => {
		        	//console.log('Updated - ' + obj);
					client.close();
		        	callback(obj);
		        })
		        .catch((err) => {
		        	//console.log('Error: ' + err);
					client.close();
		        	callback(err);
		      	});
		  	});
		} catch (err) {
			callback(err, null);
		}
	},
	insert: function(dbName, collection, data, callback){
		try {
			connect(dbName, function(db, client){
				db.collection(collection).insert(data, function(err, res) {
				    if (err) throw err;
				    //console.log("1 document inserted");
					client.close();
				    callback(err, res);
				});
		  	});
		} catch (err) {
			callback(err, null);
		}
	},
	aggregate: function(dbName, collection, query, callback){
		try {
			connect(dbName, function(db, client){
				const coll = db.collection(collection);
				var cursor = coll.aggregate(query, {
		          cursor: {batchSize:100}
		        });

				cursor.get(function(err, docs) {
					client.close();
					callback(err, docs);
				});
			});
		} catch (err) {
			callback(err, null);
		}
	}
}