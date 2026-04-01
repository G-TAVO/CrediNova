// ===========================
// CONFIGURACIÓN DE FIREBASE
// ===========================
// ⚠️ Cuando me envíes tus claves de Firebase, las pongo aquí
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===========================
// REGISTRO DE USUARIO
// ===========================
async function registerUser() {
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Crear perfil básico del usuario en la BD
        await db.collection("usuarios").doc(userCredential.user.uid).set({
            email: email,
            rol: "usuario",
            fechaRegistro: new Date()
        });

        alert("Registro exitoso. Ahora inicia sesión.");
        window.location.href = "login.html";

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ===========================
// LOGIN DE USUARIO
// ===========================
async function loginUser() {
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;

    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        const uid = result.user.uid;

        const userDoc = await db.collection("usuarios").doc(uid).get();

        if (!userDoc.exists) {
            alert("Usuario no encontrado en la base de datos.");
            return;
        }

        const data = userDoc.data();

        // Verifica si es admin
        if (data.rol === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "panel.html";
        }

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ===========================
// CERRAR SESIÓN
// ===========================
function logoutUser() {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
}

// ===========================
// SOLICITAR PRÉSTAMO
// ===========================
async function solicitarPrestamo() {
    const monto = parseInt(document.getElementById("monto").value);

    if (monto < 50000) {
        alert("El monto mínimo es 50.000");
        return;
    }

    const interes = monto * 0.10;
    const total = monto + interes;

    const user = auth.currentUser;
    if (!user) return alert("No hay sesión activa");

    await db.collection("prestamos").add({
        uid: user.uid,
        monto: monto,
        interes: interes,
        total: total,
        estado: "pendiente",
        fecha: new Date()
    });

    alert("Solicitud enviada. Espera aprobación.");
    cargarPrestamosUsuario();
}

// ===========================
// CARGAR PRÉSTAMOS DEL USUARIO
// ===========================
async function cargarPrestamosUsuario() {
    const user = auth.currentUser;
    if (!user) return;

    const lista = document.getElementById("listaPrestamos");

    const query = await db.collection("prestamos")
        .where("uid", "==", user.uid)
        .orderBy("fecha", "desc")
        .get();

    lista.innerHTML = "";

    query.forEach(doc => {
        const p = doc.data();
        lista.innerHTML += `
            <div class="card">
                <p>Monto: $${p.monto}</p>
                <p>Interés: $${p.interes}</p>
                <p>Total a pagar: $${p.total}</p>
                <p>Estado: ${p.estado}</p>
            </div>
        `;
    });
}

// ===========================
// PANEL ADMIN → LISTA DE PRÉSTAMOS
// ===========================
async function cargarPrestamosAdmin() {
    const lista = document.getElementById("adminPrestamos");

    const query = await db.collection("prestamos")
        .orderBy("fecha", "desc")
        .get();

    lista.innerHTML = "";

    query.forEach(doc => {
        const p = doc.data();
        lista.innerHTML += `
            <div class="card">
                <p><b>Usuario:</b> ${p.uid}</p>
                <p>Monto: $${p.monto}</p>
                <p>Total: $${p.total}</p>
                <p>Estado: ${p.estado}</p>

                <button onclick="aprobarPrestamo('${doc.id}')">Aprobar</button>
                <button onclick="rechazarPrestamo('${doc.id}')">Rechazar</button>
            </div>
        `;
    });
}

async function aprobarPrestamo(id) {
    await db.collection("prestamos").doc(id).update({ estado: "aprobado" });
    alert("Préstamo aprobado");
    cargarPrestamosAdmin();
}

async function rechazarPrestamo(id) {
    await db.collection("prestamos").doc(id).update({ estado: "rechazado" });
    alert("Préstamo rechazado");
    cargarPrestamosAdmin();
}

// ===========================
// ACCIONES AUTOMÁTICAS SEGÚN LA PÁGINA
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const ruta = window.location.pathname;

    if (ruta.includes("panel.html")) {
        auth.onAuthStateChanged(user => {
            if (!user) window.location.href = "login.html";
            cargarPrestamosUsuario();
        });
    }

    if (ruta.includes("admin.html")) {
        auth.onAuthStateChanged(async user => {
            if (!user) return window.location.href = "login.html";

            const userDoc = await db.collection("usuarios").doc(user.uid).get();
            if (!userDoc.exists || userDoc.data().rol !== "admin") {
                return window.location.href = "panel.html";
            }

            cargarPrestamosAdmin();
        });
    }
});
