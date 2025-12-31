// ui.js
import { auth, db } from "./firebase.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Elementos da UI
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
const asideBtns = document.querySelectorAll("aside button");

// --- Função para atualizar saldo de forma segura ---
export async function atualizarSaldo(uid, novoSaldo) {
    if (novoSaldo === undefined || novoSaldo === null) {
        console.error("Saldo inválido:", novoSaldo);
        return;
    }
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { saldo: novoSaldo });
    topSaldo.textContent = `Saldo: ${novoSaldo} coins`;
}

// --- Função para carregar saldo do Firestore ---
async function carregarSaldo(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const saldo = docSnap.data().saldo ?? 1000;
        topSaldo.textContent = `Saldo: ${saldo} coins`;
        return saldo;
    } else {
        await setDoc(docRef, { saldo: 1000, nickname: emailInput.value.split("@")[0], avatar: "images/default.png" });
        topSaldo.textContent = "Saldo: 1000 coins";
        return 1000;
    }
}

// --- Login ---
btnLogin.addEventListener("click", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, senhaInput.value);
        await carregarSaldo(userCredential.user.uid);
    } catch (error) {
        alert("Erro no login: " + error.message);
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
    } catch (error) {
        alert("Erro no registro: " + error.message);
    }
});

// --- Logout ---
btnLogout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logout efetuado com sucesso!");
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout: " + error.message);
    }
});

// --- Monitorar estado de autenticação ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Usuário logado
        authContainer.style.display = "none";
        aside.style.display = "block";
        telas.forEach(tela => tela.style.display = "none");
        await carregarSaldo(user.uid);
    } else {
        // Usuário deslogado
        authContainer.style.display = "block";
        aside.style.display = "none";
        topSaldo.textContent = "Saldo: 0 coins";
        telas.forEach(tela => tela.style.display = "none");
    }
});

// --- Controle de abas ---
asideBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tela;
        telas.forEach(tela => tela.style.display = "none");
        const secao = document.getElementById(target);
        if (secao) secao.style.display = "block";
    });
});
