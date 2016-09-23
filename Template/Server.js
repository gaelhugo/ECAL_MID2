var serverWebSocket = require('websocket').server;
var http = require('http');

function callback(a,b){
  console.log(a);
  console.log(b);
}

var server = http.createServer(callback);
var port = 1337;
server.listen(port, function(){
  console.log("Le port 1337 est ouvert")
});

var pipeline = new serverWebSocket({
  httpServer:server
})
