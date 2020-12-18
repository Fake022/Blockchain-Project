
let ws = new WebSocket('ws://localhost:8000/');
const broadcastChannel = new BroadcastChannel("WebSocketChannel");
const  idToPortMap  = {};

ws.onopen = () => broadcastChannel.postMessage({ type: "WSState", state: ws.readyState });
ws.onclose = () => broadcastChannel.postMessage({ type: "WSState", state: ws.readyState });

heartbeat();

function heartbeat() {
    setInterval(() => { ws.send("heartbeat"); }, 500);
}

ws.onmessage  = ({ data }) => {
    console.log('test');
    console.log(data);
    const parsedData = { data: JSON.parse(data), type: "message" }
    if (!parsedData.data.from) {
      console.log(parsedData);
      broadcastChannel.postMessage(parsedData);
    } else {
      idToPortMap[parsedData.data.from].postMessage(parsedData);
    }
};

onconnect = e => {
    const  port  =  e.ports[0];
    port.onmessage  =  msg  => {
        idToPortMap[msg.data.from] =  port;
          console.log(msg.data.data);
          ws.send(msg.data.data);
          port.postMessage({ state: ws.msreadyState, type: "WSState"});
    };
};