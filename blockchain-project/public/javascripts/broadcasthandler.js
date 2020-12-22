const worker = new SharedWorker("./src/websocket_client.js");

const id = uuid.v4();

let  webSocketState  =  WebSocket.CONNECTING;

console.log(`Initializing the web worker for user: ${id}`);

worker.port.start();

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

function  handleMessageFromPort(data) {

    console.log(`This message is meant only for user with id: ${id}`);
    console.log(data);
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
    serviceAvailable(data);
}

function serviceAvailable(data) {
    var data = JSON.parse(data);
    if (data.msg == "new transaction node") {
        document.getElementById('alert').style.display = "block";
        setTimeout(function(){
            document.getElementById('alert').style.display = "none";
        }, 2000);
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
