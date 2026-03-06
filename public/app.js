const API = "/api";

/* REGISTRAR USUARIO */

async function register(){

let username = document.getElementById("regUser").value;
let password = document.getElementById("regPass").value;
let refer = document.getElementById("refer").value;

let res = await fetch(API + "/register",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
password,
refer

})

});

let data = await res.json();

alert(data.message);

}


/* LOGIN */

async function login(){

let username = document.getElementById("loginUser").value;
let password = document.getElementById("loginPass").value;

let res = await fetch(API + "/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
password

})

});

let data = await res.json();

if(data.success){

localStorage.setItem("user",JSON.stringify(data.user));

window.location.reload();

}else{

alert("Datos incorrectos");

}

}


/* MOSTRAR USUARIO */

function cargarUsuario(){

let user = localStorage.getItem("user");

if(!user){

return;

}

user = JSON.parse(user);

document.getElementById("username").innerText = user.username;

document.querySelector(".saldo").innerText = "$" + user.saldo;

}

window.onload = cargarUsuario;


/* CERRAR SESION */

function logout(){

localStorage.removeItem("user");

location.reload();

}
