/* ==========================
   VERIFICAR LOGIN
========================== */
function verificarLogin() {
  let user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html";
  }
}

/* ==========================
   MOSTRAR NOMBRE DE USUARIO
========================== */
function mostrarUsuario() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  let nombre = document.getElementById("username");
  if (nombre) nombre.innerText = user.username;
}

/* ==========================
   MOSTRAR SALDO
========================== */
function mostrarSaldo() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  let saldo = document.querySelector(".saldo");
  if (saldo) saldo.innerText = "$" + user.saldo;
}

/* ==========================
   CERRAR SESIÓN
========================== */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/* ==========================
   FIREBASE CONFIG
========================== */

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ==========================
   CARGAR INFORMACIÓN DE USUARIO
========================== */
function cargarDatosUsuario() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  db.ref("usuarios/" + user.uid).once("value", snapshot => {
    if (snapshot.exists()) {
      let datos = snapshot.val();

      user.saldo = datos.saldo;
      localStorage.setItem("user", JSON.stringify(user));

      mostrarSaldo();
    }
  });
}

/* ==========================
   ACTUALIZAR SALDO
========================== */
function actualizarSaldo(nuevoSaldo) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  db.ref("usuarios/" + user.uid).update({
    saldo: nuevoSaldo
  });

  user.saldo = nuevoSaldo;
  localStorage.setItem("user", JSON.stringify(user));

  mostrarSaldo();
}

/* ==========================
   REGISTRAR MOVIMIENTO
========================== */
function registrarMovimiento(tipo, monto) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  let mov = {
    tipo: tipo,
    monto: monto,
    fecha: new Date().toLocaleString()
  };

  db.ref("movimientos/" + user.uid).push(mov);
}

/* ==========================
   INICIAR APP
========================== */
document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();
  mostrarUsuario();
  mostrarSaldo();
  cargarDatosUsuario();
});
