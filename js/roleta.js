
import { auth } from "./firebase.js";
import { atualizarSaldo, adicionarAposta } from "./saldo.js";

const roletaSpin = document.getElementById("roleta-spin");
const roletaTipo = document.getElementById("roleta-tipo");
const roletaNumeroInput = document.getElementById("roleta-numero");
const roletaResultado = document.getElementById("roleta-resultado");
const roletaApostaInput = document.getElementById("roleta-aposta");
const numeroContainer = document.getElementById("numero-container");

// Mostrar input número apenas se tipo for número
roletaTipo.addEventListener("change", () => {
    numeroContainer.style.display = roletaTipo.value === "numero" ? "block" : "none";
});

roletaSpin.addEventListener("click", async () => {
    const user = auth.currentUser;
    if(!user) return alert("Você precisa estar logado para apostar!");

    const aposta = parseInt(roletaApostaInput.value);
    let saldo = parseInt(document.getElementById("top-saldo").textContent.replace(/\D/g,''));
    if(saldo < aposta) return alert("Saldo insuficiente!");

    saldo -= aposta;
    await atualizarSaldo(user.uid, saldo);

    // Gira roleta
    const resultadoNumero = Math.floor(Math.random() * 37); // 0-36
    const resultadoCor = (resultadoNumero === 0) ? "verde" : (resultadoNumero % 2 === 0 ? "preto" : "vermelho");

    let ganhou = false;
    if(roletaTipo.value === "cor") {
        const corEscolhida = prompt("Escolha a cor: vermelho, preto ou verde").toLowerCase();
        ganhou = corEscolhida === resultadoCor;
    } else {
        const numeroEscolhido = parseInt(roletaNumeroInput.value);
        ganhou = numeroEscolhido === resultadoNumero;
    }

    let premio = 0;
    if(ganhou) {
        premio = roletaTipo.value === "cor" ? aposta*2 : aposta*35;
        saldo += premio;
    }

    await atualizarSaldo(user.uid, saldo);
    roletaResultado.textContent = `Número: ${resultadoNumero} (${resultadoCor}) - ${ganhou ? `Você ganhou ${premio} coins! 🎉` : "Você perdeu 💔"}`;

    await adicionarAposta(user.uid, aposta, ganhou ? "Ganhou Roleta" : "Perdeu Roleta");
});
