'use strict';

function sendToMining(i) {
    i = i + 1;
    var button = document.getElementById(`sendmining${i}`);
    console.log(button, i);
    const transactionlist = JSON.parse(transactions);
    const uri = 'http://localhost:8000/node/sendMining';
    const initDetails = {
      method: 'post',
      body: JSON.stringify(transactionlist[i]),
      headers: {"Content-Type": "application/json"}
    }
    fetch(uri, initDetails).then(response => {
      if (response.status == 200) {
        console.log("oke");
        document.getElementById("table").deleteRow(i);
        button.setAttribute("disabled", "");
      } else {
        console.log('Error Validate: something went wrong ...');
      }
    });
}