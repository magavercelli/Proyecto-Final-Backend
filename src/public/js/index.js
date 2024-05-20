const socket = io();


socket.on('products', function(data){
  console.log('products', data.product);
  
    const div = document.getElementById('products-add');
    div.innerHTML = '';

    data.product.forEach(product => {
        const listUl = document.createElement('ul');
        listUl.innerHTML= `
        <li>${product.title} </li>
        <li>${product.description} </li>
        <li>${product.price} </li>
        `;
  
        div.appendChild(listUl);
    });
})