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

function verifBalance(index) {
  const uri = 'http://localhost:8000/wallet/getBalance';
  const initDetails = {
    method: 'get',
    headers: {
       "Content-Type": "application/json; charset=utf-8"
    },
  };
  fetch(uri, initDetails).then(response => {
    if (response.status == '200') {
      console.log(response);
     return response.json();
    } else  {
      console.log('Error getBalance: something went wrong ...');
    }
  }).then(res => {
    var total = JSON.parse(res.body);
    var amount = document.getElementById('amount-' + index).innerText;
    console.log('local_amount : ' + amount);
    console.log('total: ' + total);
    if (parseInt(total) >= parseInt(amount)) {
      document.getElementById('button-' + index).innerHTML = '<td><div id="button-'+ index +'" class="button_send_mining"><button type="button" class="btn btn-success">OK</button></div></td>';
    } else {
      document.getElementById('button-' + index).innerHTML = '<td><div id="button-'+ index +'" class="button_send_mining"><button type="button" class="btn btn-danger">Not enough in balance</button></div></td>';
    }
  });
}

function listcmp(arg1, arg2) {
  if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)){
    if (Object.prototype.toString.call(arg1) === '[object Object]' || Object.prototype.toString.call(arg1) === '[object Array]' ){
      if (Object.keys(arg1).length !== Object.keys(arg2).length ){
        return false;
      }
      return (Object.keys(arg1).every(function(key){
        return listcmp(arg1[key],arg2[key]);
      }));
    }
    return (arg1===arg2);
  }
  return false;
};

function checklinediff(arg1, arg2) {
  var index;
  if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)){
    if (Object.prototype.toString.call(arg1) === '[object Object]' || Object.prototype.toString.call(arg1) === '[object Array]' ){
      if (Object.keys(arg1).length !== Object.keys(arg2).length){
        (Object.keys(arg1).length > Object.keys(arg2).length) ? index = Object.keys(arg2).length : index = Object.keys(arg1).length;
        return index;
      }
    }
  }
}

function verifSignature(index) {
  const uri = 'http://localhost:8000/wallet/verifSign';
  console.log(index);
  var amount  = document.getElementById('amount-' + index).innerText;
  var fee  = document.getElementById('fee-' + index).innerText;
  var from  = document.getElementById('from-' + index).innerText;
  var to  = document.getElementById('to-' + index).innerText;
  var signature  = document.getElementById('signature-' + index).innerText;
  console.log(from);
  console.log(to);
  const initDetails = {
    method: 'post',
    headers: {
       "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({amount: amount, fee: fee, from: from, to: to, signature: signature})
  };
  fetch(uri, initDetails).then(response => {
    if (response.status == '200') {
      console.log(response);
     return response.json();
    } else  {
      console.log('Error verifSignature: something went wrong ...');
    }
  }).then(res => {
    var verif_sign = JSON.parse(res.body);
    console.log(verif_sign);
    (verif_sign == true) ? document.getElementById('button-verif' + index).innerHTML = '<td><div id="button-verif'+ index +'" class="button_send_mining"><button type="button" class="btn btn-success">OK</button></div></td>' : document.getElementById('button-verif' + index).innerHTML = '<td><div id="button-'+ index +'" class="button_send_mining"><button type="button" class="btn btn-danger">Not valid</button></div></td>';
  });
}

function sendToMining() {
  
}

function saveList(data) {
  local_list = JSON.parse(localStorage.getItem('transaction_list'));
  if (document.getElementById('table-body') == null && local_list !== 'undefined') {
    localStorage.clear();
    console.log('ici');
  }
  if (local_list == null) {
    var i = 0;
    console.log('debug1');
    document.getElementById('transaction-list').innerHTML = '<tr id="table-body">';
    data.forEach(node => {
      var tmp = document.getElementById('transaction-list').innerHTML;
      i++;
      console.log(node.Fee);
      document.getElementById('transaction-list').innerHTML =  tmp + '<td>'+ i + '</td>' +'<td id="amount-' + i + '">' + node.Amount + '</td>' + '<td id="fee-' + i + '">' + node.Fee + '</td>'  + '<td id="from-' + i + '">' + node.From + '</td>' + '<td id="to-' + i + '">' + node.To + '</td>' + '<td id="signature-' + i + '">' + node.Signature + '</td>' 
      + '<td><div id="button-'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="verifBalance('+ i +')">Check Balance</button></div></td>'
      + '<td><div id="button-verif'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="verifSignature('+ i +')">Check Signature</button></div></td>'
      + '<td><div id="button-send'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="sendToMining('+ i +')">Send To Mempool</button></div></td>';
   });
   var tmp = document.getElementById('transaction-list').innerHTML; 
   document.getElementById('transaction-list').innerHTML = tmp + '</tr>';
   localStorage.setItem('transaction_list', JSON.stringify(data));
   local_list = JSON.parse(localStorage.getItem('transaction_list'));
  }
  console.log(local_list);
  if (listcmp(data, local_list) == false) {
    console.log('debug2');
    var index = checklinediff(data, local_list);
    var i = 1;
    console.log('index: ' + index);
      data.forEach(node => {
        var tmp = document.getElementById('transaction-list').innerHTML;
        if (parseInt(i) > parseInt(index)) {
          document.getElementById('transaction-list').innerHTML =  tmp + '<td>'+ i + '</td>' +'<td id="amount-' + i + '">' + node.Amount + '</td>' + '<td id="fee-' + i + '">' + node.Fee + '</td>'  + '<td id="from-' + i + '">' + node.From + '</td>' + '<td id="to-' + i + '">' + node.To + '</td>' + '<td id="sign-' + i + '">' + node.Signature + '</td>' 
          + '<td><div id="button-'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="verifBalance('+ i +')">Check Balance</button></div></td>'
          + '<td><div id="button-verif'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="verifSignature('+ i +')">Check Signature</button></div></td>'
          + '<td><div id="button-send'+ i +'" class="button_send_mining"><button type="button" class="btn btn-primary" onclick="sendToMining('+ i +')">Send To Mempool</button></div></td>';
        }
        i++;
      });
    localStorage.setItem('transaction_list', JSON.stringify(data));
  }
}

