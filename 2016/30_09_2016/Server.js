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

var clients = []; // [0,1,2,3,4,5,6]

pipeline.on('request',function(e){

  var connection = e.accept(null, e.origin);
  //clients.push(connection);
  var date = new Date();
  var nom = "client_"+date.getHours()+date.getMinutes()+date.getSeconds()+date.getMilliseconds();
  console.log("NOUVEAU CLIENT : "+ nom);
  clients[nom] = {"connection":connection};

  connection.on('message', function(message){
      //console.log(message);
      var json = JSON.parse(message.utf8Data);
      console.log(json);
      for(var name in clients){
         if(name != nom && clients[name].connection!= undefined){
            clients[name].connection.send(JSON.stringify(json));
         }
      }
  });

  connection.on('close', function(connection){
    console.log("la conneciton "+ connection + "a quitté.");
  });
});
