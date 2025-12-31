import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { atualizarSaldo } from "./saldo.js"; // função para atualizar saldo

// Elementos
const authContainer = document.getElementById("auth-container");
const btnLogin = document.getElementById("btn-login");
const btnRegistrar = document.getElementById("btn-registrar");
const btnLogout = document.getElementById("btn-logout");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const nicknameInput = document.getElementById("nickname");
const topSaldo = document.getElementById("top-saldo");
const aside = document.querySelector("aside");
const telas = document.querySelectorAll(".tela");

// --- Login ---
btnLogin.addEventListener("click", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, senhaInput.value);
        // Carrega saldo
        await atualizarSaldo(userCredential.user.uid);
    } catch(error){
        alert(error.message);
    }
});

// --- Registro ---
btnRegistrar.addEventListener("click", async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, senhaInput.value);
        const uid = userCredential.user.uid;
        const nickname = nicknameInput.value || emailInput.value.split("@")[0];
        await setDoc(doc(db, "users", uid), { saldo: 1000, nickname: nickname, avatar: "images/default.png" });
        alert("Usuário registrado com sucesso!");
    } catch(error){
        alert(error.message);
    }
});

// --- Logout ---
btnLogout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logout efetuado com sucesso!");
    } catch(error){
        console.error(error);
        alert("Erro ao fazer logout: " + error.message);
    }
});

// --- Monitorar estado de autenticação ---
onAuthStateChanged(auth, (user) => {
    if(user){
        authContainer.style.display = "none";
        aside.style.display = "block";
        topSaldo.textContent = "Saldo: 0 coins"; // atualizar com Firestore se quiser
        telas.forEach(tela => tela.style.display = "none");
    } else {
        authContainer.style.display = "block";
        aside.style.display = "none";
        topSaldo.textContent = "Saldo: 0 coins";
        telas.forEach(tela => tela.style.display = "none");
    }
});
