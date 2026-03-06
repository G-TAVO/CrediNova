const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

/* BASE DE DATOS SIMPLE (temporal) */

let users = [];

/* REGISTRO */

app.post("/api/register", (req, res) => {

const { username, password, refer } = req.body;

if(!username || !password){
return res.json({success:false,message:"Datos incompletos"});
}

let exist = users.find(u => u.username === username);

if(exist){
return res.json({success:false,message:"Usuario ya existe"});
}

let newUser = {

id:Date.now(),

username,
password,

saldo:0,

vip:0,

refer,

referidos:[]

};

users.push(newUser);

if(refer){

let refUser = users.find(u=>u.username===refer);

if(refUser){
refUser.referidos.push(username);
}

}

res.json({success:true,message:"Usuario registrado"});

});


/* LOGIN */

app.post("/api/login",(req,res)=>{

const {username,password} = req.body;

let user = users.find(u=>u.username===username && u.password===password);

if(!user){

return res.json({success:false,message:"Datos incorrectos"});

}

res.json({success:true,user});

});


/* VER USUARIOS (ADMIN) */

app.get("/api/admin/users",(req,res)=>{

res.json(users);

});


/* ACTIVAR VIP */

app.post("/api/admin/activar",(req,res)=>{

const {username,vip} = req.body;

let user = users.find(u=>u.username===username);

if(!user){

return res.json({success:false});

}

user.vip = vip;

res.json({success:true});

});


/* EDITAR SALDO */

app.post("/api/admin/saldo",(req,res)=>{

const {username,saldo} = req.body;

let user = users.find(u=>u.username===username);

if(!user){

return res.json({success:false});

}

user.saldo = saldo;

res.json({success:true});

});


app.listen(PORT,()=>{

console.log("Servidor funcionando");

});
