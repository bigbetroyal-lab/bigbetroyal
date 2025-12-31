
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { criarDocumentoUsuario, carregarSaldo, carregarHistorico } from "./saldo.js";

export function setupAuth() {
    const btnLogout = document.getElementById("btn-logout");

    onAuthStateChanged(auth, async (user) => {
        const telas = document.querySelectorAll(".tela");
        if (user) {
            document.querySelector("aside").style.display = "block";
            document.getElementById("top-saldo").style.display = "inline";
            await carregarSaldo(user.uid);
            await carregarHistorico(user.uid);
        } else {
            document.querySelector("aside").style.display = "none";
            document.getElementById("top-saldo").style.display = "none";
            telas.forEach(tela => tela.style.display = tela.id === "historico" ? "block" : "none");
        }
    });

    btnLogout.addEventListener("click", async () => {
        await signOut(auth);
    });
}

// Registrar e login podem ser adicionados em modais ou páginas separadas
