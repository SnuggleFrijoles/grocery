var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');
//adding a comment here
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// Create list
var groceries = ["Milk", "Eggs", "Bread"];

// Build server

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});


// Set up connection function
io.on('connection', function(socket){
	console.log("User connected");
	
	// Give new user past groceries
	for (var i = 0; i < groceries.length; i++) {
		socket.emit('add', groceries[i]);
	};

	// Do something with incoming groceries
	socket.on('add', function(grocery){
		// Store grocery and send to all clients
		console.log(grocery);
		groceries.push(grocery);
		io.emit('add', grocery);
	});

	socket.on('remove', function(grocery){
		// See if the grocery is in the list
		var index = groceries.indexOf(grocery);
		if (index != -1) {
			groceries.splice(index, 1);
			io.emit('remove', grocery, index);
		}
	});
});

// Start server
http.listen(server_port, server_ip_address, function(){
	console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
