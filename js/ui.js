// Import Firebase Auth
import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Seleciona elementos
const btnLogout = document.getElementById("btn-logout");
const topSaldo = document.getElementById("top-saldo");
const aside = document.querySelector("aside");
const telas = document.querySelectorAll(".tela");

// Logout
btnLogout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logout efetuado com sucesso!");
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout: " + error.message);
    }
});

// Atualiza UI com base no estado do usuário
onAuthStateChanged(auth, (user) => {
    if(user){
        // Usuário logado
        aside.style.display = "block";
        topSaldo.textContent = "Saldo: 0 coins"; // ou carregar saldo real do Firestore
        telas.forEach(tela => tela.style.display = "none"); // esconde todas telas inicialmente
    } else {
        // Usuário deslogado
        aside.style.display = "none";
        topSaldo.textContent = "Saldo: 0 coins";
        telas.forEach(tela => tela.style.display = "none"); // esconde todas telas
        alert("Você saiu da conta. Faça login para continuar jogando!");
    }
});
