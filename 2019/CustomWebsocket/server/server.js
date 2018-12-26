var port = 1337;
var http = require('http');
var server = http.createServer(function(request, response) {});
server.listen(port, function() {
  console.log('Le port ' + port + ' est ouvert.');
});

var serverWebSocket = require('websocket').server;
var wsServer = new serverWebSocket({httpServer: server});

var clients = [];

wsServer.on('request', function(request) {

  var connection = request.accept(null, request.origin);
  var date = new Date();
  var clientName = 'client_' + date.getHours() + date.getMinutes() +
      date.getSeconds() + date.getMilliseconds();
  clients[clientName] = {'connection': connection, 'name': clientName};
  console.log('nouveau client');
  connection.on('message', function(message) {
    var json = JSON.parse(message.utf8Data);
    // on renvoie les datas à tous les joueurs, sauf soit même
    for (var name in clients) {
      if (name != clientName) {
        clients[name].connection.send(JSON.stringify({message: json}));
      }
    }
  });

  connection.on('close', function(connection) {
    // connection == la connection qui quitte
  });

});
