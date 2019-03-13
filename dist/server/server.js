const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
const express = require('express');
const bodyParser = require('body-parser');
const url = "mongodb://test:testpassword@spot-stop-shard-00-00-ruq20.mongodb.net:27017,spot-stop-shard-00-01-ruq20.mongodb.net:27017,spot-stop-shard-00-02-ruq20.mongodb.net:27017/test?ssl=true&replicaSet=spot-stop-shard-0&authSource=admin&retryWrites=true";
const server = express();
const port = 8080;
const path  = require('path');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

function handleClient(ip) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ ip: ip }, function(err, result) {
			if (err) throw err;
			if (!result) { addClient(ip); }
			db.close();
		});
	});
}

function handleMarkerC(ip, _id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOne({ip: ip}, function(err, result) {
			if (err) throw err;
			if (result) {
				dbo.collection("clients").update({ip: ip}, { $push: { markerListC: _id } });
			}
			db.close();
		});
	});
}

function checkMarkerExistsM(ip, id) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("clients").findOnegcl({ ip: ip, markerListM: [id] }, function(err, result) {
			if (err) throw err;
			if (result) { 
				db.close();
			}
			db.close();
		});
	});

	return false;
}

function addClient(ip) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var client = { ip: ip, markerListM: [], markerListC: [] };
		dbo.collection("clients").insertOne(client, function(err, result) {
			if (err) throw err;
			console.log("Inserted Client with IP { " + client.ip + " }");
			db.close();
		});
	});
}

function addMarker(res, ip, name, lat, lng, des, upvote, downvote){ 
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var marker = { lat: lat, lng: lng, name:name,des: des, upvote: upvote, downvote: downvote};
		dbo.collection("markers").insertOne(marker, function(err, result) {
			if (err) throw err;
			res.send(marker._id);
			console.log("Inserted Marker at { " + lat + ", " + lng + " } with ID { " + marker._id + " }");
			handleMarkerC(ip, marker._id);
			db.close();
		});
	});
}

function getAllMarkers(res) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		dbo.collection("markers").find({}).toArray(function(err, result) {
			if (err) throw err;
			res.send(result);
			console.log("Sending Markers to Client");
			db.close();
		});
	}); 
}

function upvoteMarker(_id, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = {  _id: ObjectId(_id) };
		dbo.collection("markers").findOne({ _id: ObjectId(_id) }, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {upvote: result.upvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				if (val > 0) {
					console.log("Upvoted Marker with { _id: " + _id + " }");
				}
			});
			db.close();
		});
	}); 
}

function downvoteMarker(_id, val) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("spot_stop");
		var myquery = {  _id: ObjectId(_id) };
		dbo.collection("markers").findOne({  _id: ObjectId(_id) }, function(err, result) {
			if (err) throw err;
			var newvalues = { $set: {downvote: result.downvote + val } };
			dbo.collection("markers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				if (val > 0) {
					console.log("Downvoted Marker with { _id: " + _id + " }");
				}
			});
			db.close();
		});
	}); 
}


server.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});


server.get('/getAllMarkers', function(req, res, next) {
	getAllMarkers(res);
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	handleClient(ip);
});

server.get('/createTestMarker', function(req, res, next) { 
	res.send('Creating Test Marker!') 
	addMarker(res, 34.5315, -123.5235, "Test Marker", 54, 21);
});

server.post("/createMarker", (req, res) => {
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	addMarker(res, ip, req.body.name, req.body.lat, req.body.lng, req.body.des, req.body.upvote, req.body.downvote);
});

server.post("/upvoteMarker", (req, res) => {
	res.send('Upvoting Marker!');
	var markerIncrement = 1;
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	// var clientIndex = checkClientExists(ip);
	// var markerIndex;
	// if (clientIndex != -1) {
	// 	markerIndex = checkMarkerExists(clientList[clientIndex].markerListM, req.body._id);
	// 	if (markerIndex == -1) {
	// 		clientList[clientIndex].markerListM.push(new Marker(req.body._id, markerIncrement));
	// 		upvoteMarker(req.body._id, markerIncrement);
	// 	}
	// 	else {
	// 		if (clientList[clientIndex].markerListM[markerIndex].value < markerIncrement) {
	// 			clientList[clientIndex].markerListM[markerIndex].value = markerIncrement;
	// 			upvoteMarker(req.body._id, markerIncrement);
	// 			downvoteMarker(req.body._id, -markerIncrement);
	// 		}
	// 	}
	// }
	upvoteMarker(req.body._id, markerIncrement);
});

server.post("/downvoteMarker", (req, res) => {
	res.send('Downvoting Marker!');
	var markerIncrement = 1;
	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
	// var clientIndex = checkClientExists(ip);
	// var markerIndex;
	// if (clientIndex != -1) {
	// 	markerIndex = checkMarkerExists(clientList[clientIndex].markerListM, req.body._id);
	// 	if (markerIndex == -1) {
	// 		clientList[clientIndex].markerListM.push(new Marker(req.body._id, -markerIncrement));
	// 		downvoteMarker(req.body._id, markerIncrement);
	// 	}
	// 	else {
	// 		if (clientList[clientIndex].markerListM[markerIndex].value > -markerIncrement) {
	// 			clientList[clientIndex].markerListM[markerIndex].value = -markerIncrement;
	// 			downvoteMarker(req.body._id, markerIncrement);
	// 			upvoteMarker(req.body._id, -markerIncrement);
	// 		}
	// 	}
	// }
	downvoteMarker(req.body._id, markerIncrement);
});


server.listen(port, () => console.log(`Server listening on port ${port}!`));