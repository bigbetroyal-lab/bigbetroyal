// ===============================
// ESTADO GLOBAL DO USUÁRIO
// ===============================
const USER_KEY = "bb_user";
const SALDO_KEY = "bb_saldo";

// ===============================
// SALDO (COINS)
// ===============================
export function getSaldo() {
    return parseInt(localStorage.getItem(SALDO_KEY) || "0");
}

export function setSaldo(valor) {
    localStorage.setItem(SALDO_KEY, valor);
    atualizarTopo();
}

export function addSaldo(valor) {
    setSaldo(getSaldo() + valor);
}

export function gastarSaldo(valor) {
    let saldo = getSaldo();
    if (saldo < valor) {
        alert("❌ Saldo insuficiente");
        return false;
    }
    setSaldo(saldo - valor);
    return true;
}

// ===============================
// USUÁRIO
// ===============================
export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ===============================
// UI
// ===============================
export function atualizarTopo() {
    const saldoEl = document.getElementById("top-saldo");
    if (saldoEl) {
        saldoEl.innerText = `Saldo: ${getSaldo()} coins`;
    }
}

// ===============================
// MOSTRAR / ESCONDER TELAS
// ===============================
function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.add("hidden"));
    const tela = document.getElementById(id);
    if (tela) tela.classList.remove("hidden");
}

// ===============================
// MENU LATERAL
// ===============================
document.querySelectorAll("aside button").forEach(btn => {
    btn.addEventListener("click", () => {
        const tela = btn.dataset.tela;
        mostrarTela(tela);
    });
});

// ===============================
// LOGOUT
// ===============================
document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
});

// ===============================
// LOGIN / REGISTRO FAKE
// ===============================
document.getElementById("btn-registrar").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const nickname = document.getElementById("nickname").value || "Jogador";

    if (!email || !senha) {
        alert("Preencha email e senha");
        return;
    }

    setUser({ email, nickname });
    setSaldo(1000); // saldo inicial
    iniciarSessao();
});

document.getElementById("btn-login").addEventListener("click", () => {
    const user = getUser();
    if (!user) {
        alert("Usuário não encontrado. Registre-se.");
        return;
    }
    iniciarSessao();
});

// ===============================
// INICIAR SESSÃO
// ===============================
function iniciarSessao() {
    document.getElementById("auth-container").classList.add("hidden");
    mostrarTela("slot");
    atualizarTopo();

    // Atualizar perfil
    const nickEl = document.getElementById("perfil-nickname");
    if (nickEl) nickEl.innerText = getUser().nickname;
}

// ===============================
// AUTO LOGIN
// ===============================
window.addEventListener("DOMContentLoaded", () => {
    if (getUser()) {
        iniciarSessao();
    }
});
