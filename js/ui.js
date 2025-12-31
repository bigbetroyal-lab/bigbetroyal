import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const btnLogout = document.getElementById("btn-logout");

btnLogout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logout efetuado com sucesso!");
        // Atualiza UI
        document.getElementById("top-saldo").textContent = "Saldo: 0 coins";
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout: " + error.message);
    }
});

