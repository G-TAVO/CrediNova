// ---------------------------
// Inicializar Firebase
// ---------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCa2FEmC5RUFbv8omJytOvn3qX8eCcPEQo",
    authDomain: "credinova-15f16.firebaseapp.com",
    projectId: "credinova-15f16",
    storageBucket: "credinova-15f16.firebasestorage.app",
    messagingSenderId: "546178627119",
    appId: "1:546178627119:web:62999bd9c4907a284478da",
    measurementId: "G-RTECMLHJEP"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase cargado correctamente");

// ------------------------------------------------
// FUNCIONES PARA GUARDAR PRÉSTAMOS
// ------------------------------------------------

async function registrarPrestamo() {
    const nombre = document.getElementById("nombre").value;
    const monto = document.getElementById("monto").value;
    const fecha = document.getElementById("fecha").value;

    if (!nombre || !monto || !fecha) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        await addDoc(collection(db, "prestamos"), {
            nombre: nombre,
            monto: Number(monto),
            fecha: fecha,
            creado: new Date()
        });

        alert("Préstamo registrado exitosamente");
        limpiarCampos();
    } catch (e) {
        console.error("Error al guardar:", e);
        alert("Hubo un error al guardar");
    }
}

// Limpiar formulario
function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("fecha").value = "";
}

// Hacer la función accesible desde HTML
window.registrarPrestamo = registrarPrestamo;

// ---------------------------------
// PWA - REGISTER SERVICE WORKER
// ---------------------------------
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker registrado"))
        .catch(err => console.log("Error en SW:", err));
}
