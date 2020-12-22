const worker = new SharedWorker("/javascripts/websocket_client.js");
const id = uuidv4();
let  webSocketState  =  WebSocket.CONNECTING;
console.log(`Initializing the web worker for user: ${id}`);
worker.port.start();
//checkTransaction();
//
//
//function checkTransaction() {  
//    postMessageToWSServer("get_transaction");
//    setInterval(() => { checkTransaction(); }, 5000);
//}

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
    console.log(data);
    saveList(data);
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

function handleBroadcast(data) {
  console.log("This message is meant for everyone!");
  console.log(data.data.list_transaction);
  saveList(data.data.list_transaction);
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

function sendToMining(){
  
}

function saveList(data) {
    document.getElementById('transaction-list').innerHTML = '<tr>';
    var i = 0;
    data.forEach(node => {
       var tmp = document.getElementById('transaction-list').innerHTML;
       i++;
       document.getElementById('transaction-list').innerHTML =  tmp + '<td>'+ i + '</td>' +'<td>' + node.Amount + '</td>' + '<td>' + node.Fee + '</td>'  + '<td>' + node.From + '</td>' + '<td>' + node.To + '</td>' + '<td>' + node.Signature + '</td>' + 
       '<td><div class="button_send_mining"><button type="button" class="btn btn-success" onclick="sendToMining()">Send</button></div></td>';
    });
    var tmp = document.getElementById('transaction-list').innerHTML;
    document.getElementById('transaction-list').innerHTML = tmp + '</tr>';
}

