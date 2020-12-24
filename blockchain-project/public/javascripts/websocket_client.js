
let ws = new WebSocket('ws://localhost:8000/');
const broadcastChannel = new BroadcastChannel("WebSocketChannel");
const  idToPortMap  = {};

let connected = false;

ws.onopen = () => broadcastChannel.postMessage({ type: "WSState", state: ws.readyState });
ws.onclose = () => broadcastChannel.postMessage({ type: "WSState", state: ws.readyState });

ws.onmessage  = ({ data }) => {
    const parsedData = { data: JSON.parse(data), type: "message" }
    if (!parsedData.data.from) {
      broadcastChannel.postMessage(parsedData);
    } else {
      idToPortMap[parsedData.data.from].postMessage(parsedData);
    }
};

setInterval(() => { getNewTransaction(); }, 2500);

function getNewTransaction() {
  if (connected == true) {
    ws.send("get_transaction");
  }
}

onconnect = e => {
    const  port  =  e.ports[0];
    port.onmessage  =  msg  => {
      if (msg.data.data == "get_user_list") connected = true;
        idToPortMap[msg.data.from] =  port;
          ws.send(msg.data.data);
    };
    port.postMessage({ state: ws.readyState, type: "WSState"});
};