setTimeout(getToEconomy, 500);

function sendToEconomy() {
    const pk = document.getElementById('public-key').value;
    const gs = document.getElementById('goodservice').value;
    const price = document.getElementById('price').value;
    const uri = 'http://localhost:8000/economy/list';
    const initDetails = {
        method: 'post',
        headers: {
           "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({publicKey: pk, product:gs, price: price})
    };
    console.log(pk + '\n' + gs + '\n' + price);
    fetch(uri, initDetails).then(response => {
        if (response.status == '200') {
          console.log(response);
         return response.json();
        } else  {
          console.log('Error Savekeys: something went wrong ...');
        }
      }).then(res => {
        console.log(res);
        document.getElementById('alert-send').style.display = "block";
        setTimeout(function(){
            document.getElementById('alert-send').style.display = "none";
        }, 2000);
        
    });
}

function getToEconomy() {
    const uri = 'http://localhost:8000/economy/getList';
    const initDetails = {
        method: 'get',
        headers: {
           "Content-Type": "application/json; charset=utf-8"
        },
      }
      fetch(uri, initDetails).then(response => {
        if (response.status == 200) {
         return response.json();
        } else  {
          console.log('Error: something went wrong ...');
        }
      }).then(res => {
         console.log(res);
         document.getElementById('economy-list').innerHTML = '<tr>';
         var list = res.economy;
         list.forEach(node => {
            var tmp = document.getElementById('economy-list').innerHTML;
            document.getElementById('economy-list').innerHTML =  tmp + '<td>'+ node.PublicKey + '</td>' +'<td>' + node.Product + '</td>' + '<td>' + node.Price + '</td>';
         })
         var tmp = document.getElementById('economy-list').innerHTML;
         document.getElementById('economy-list').innerHTML = tmp + '</tr>';
         document.getElementById('alert').style.display = "block";
         setTimeout(function(){
             document.getElementById('alert').style.display = "none";
         }, 2000);
         setTimeout(getToEconomy, 1000);
    });
}