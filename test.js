var Client = require('./client').Client;

var c = new Client('127.0.0.1', 29999, 'InodeSim');

var pong = require('./pong');
c.addPlugin(pong);

c.connect();
