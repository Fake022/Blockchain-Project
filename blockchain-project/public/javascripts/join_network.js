const worker = new SharedWorker("/javascripts/websocket_client.js");
const id = uuidv4();
let  webSocketState  =  WebSocket.CONNECTING;
console.log(`Initializing the web worker for user: ${id}`);
worker.port.start();

function JoinNetwork() {  
  postMessageToWSServer("get_user_list");
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

worker.port.onmessage = event => {
    switch (event.data.type) {
      case "WSState":
        webSocketState = event.data.state;
        break;
      case "message":
        handleMessageFromPort(event.data);
        break;
    }
};

function handleMessageFromPort(data) {
    console.log(`This message is meant only for user with id: ${id}`);
    var data = JSON.parse(data);
    console.log(data);
    if (data.list_user !== undefined) {
      saveList(data);
    }
}

const broadcastChannel = new BroadcastChannel("WebSocketChannel");

broadcastChannel.addEventListener("message", event => {
  switch (event.data.type) {
    case  "WSState":
      webSocketState  =  event.data.state;
      break;
    case  "message":
      handleBroadcast(event.data);
      break;
  }
});

function  handleBroadcast(data) {
  console.log("This message is meant for everyone!");
  console.log(data);
  if (typeof data.data.list_user !== 'undefined') {
    saveList(data.data);
  }
}

function  postMessageToWSServer(input) {
    if (webSocketState  ===  WebSocket.CONNECTING) {
      console.log("Still connecting to the server, try again later!");
    } else  if (
      webSocketState  ===  WebSocket.CLOSING  ||
      webSocketState  ===  WebSocket.CLOSED
    ) {
      console.log("Connection Closed!");
    } else {
      worker.port.postMessage({
        from:  id,
        data:  input
      });
    }
}

function saveList(data) {
    document.getElementById('network-list').innerHTML = '<tr>';
    var list_user = data.list_user;
      for (i = 0; i < list_user; i++) {
        console.log(list_user);
        console.log(i);
        var tmp = document.getElementById('network-list').innerHTML;
        console.log('test');
        document.getElementById('network-list').innerHTML = tmp + '<td>NODE NR ' + i  + '</td><td>Blocks</td>';
      }
      var tmp = document.getElementById('network-list').innerHTML;
      document.getElementById('network-list').innerHTML = tmp + '</tr>';
}

