/* REDIRECCION SI NO ESTA LOGUEADO */

function verificarLogin(){

let user = localStorage.getItem("user");

if(!user){

window.location.href="login.html";

}

}


/* MOSTRAR USUARIO */

function mostrarUsuario(){

let user = JSON.parse(localStorage.getItem("user"));

if(!user){

return;

}

let nombre = document.getElementById("username");

if(nombre){

nombre.innerText = user.username;

}

}


/* MOSTRAR SALDO */

function mostrarSaldo(){

let user = JSON.parse(localStorage.getItem("user"));

if(!user){

return;

}

let saldo = document.querySelector(".saldo");

if(saldo){

saldo.innerText = "$"+user.saldo;

}

}


/* CERRAR SESION */

function logout(){

localStorage.removeItem("user");

window.location.href="login.html";

}
