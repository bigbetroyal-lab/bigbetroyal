import { auth, db } from "./firebase.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { atualizarSaldo } from "./ui.js";

// --- Configuração da roleta ---
let apostaSelecionada = null;
const numeros = [
  {num:0, cor:"verde"}, {num:32, cor:"vermelho"}, {num:15, cor:"preto"},
  {num:19, cor:"vermelho"}, {num:4, cor:"preto"}, {num:21, cor:"vermelho"},
  {num:2, cor:"preto"}, {num:25, cor:"vermelho"}, {num:17, cor:"preto"},
  {num:34, cor:"vermelho"}, {num:6, cor:"preto"}, {num:27, cor:"vermelho"},
  {num:13, cor:"preto"}, {num:36, cor:"vermelho"}, {num:11, cor:"preto"},
  {num:30, cor:"vermelho"}, {num:8, cor:"preto"}, {num:23, cor:"vermelho"},
  {num:10, cor:"preto"}, {num:5, cor:"vermelho"}, {num:24, cor:"preto"},
  {num:16, cor:"vermelho"}, {num:33, cor:"preto"}, {num:1, cor:"vermelho"},
  {num:20, cor:"preto"}, {num:14, cor:"vermelho"}, {num:31, cor:"preto"},
  {num:9, cor:"vermelho"}, {num:22, cor:"preto"}, {num:18, cor:"vermelho"},
  {num:29, cor:"preto"}, {num:7, cor:"vermelho"}, {num:28, cor:"preto"},
  {num:12, cor:"vermelho"}, {num:35, cor:"preto"}, {num:3, cor:"vermelho"},
  {num:26, cor:"preto"}
];
const total = numeros.length;
const canvas = document.getElementById("canvas-roleta");
const ctx = canvas.getContext("2d");
const raio = 150;
const roletaVisual = document.getElementById("roleta-visual");
const bola = document.getElementById("bola");
const bolaRadius = 140; // distância do centro

// --- Desenhar roleta ---
function drawRoleta(){
  const angulo = (2*Math.PI)/total;
  for(let i=0;i<total;i++){
    ctx.beginPath();
    ctx.moveTo(raio,raio);
    ctx.arc(raio,raio,raio,i*angulo,(i+1)*angulo);
    ctx.fillStyle = numeros[i].cor;
    ctx.fill();
    ctx.stroke();

    // Número
    ctx.save();
    ctx.translate(raio,raio);
    ctx.rotate((i+0.5)*angulo);
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.font = "14px Arial";
    ctx.fillText(numeros[i].num, raio-10,5);
    ctx.restore();
  }
}
drawRoleta();

// --- Seleção da aposta ---
document.querySelectorAll(".aposta-btn, .numero-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    apostaSelecionada = btn.dataset.aposta;
    document.getElementById("roleta-resultado").textContent = `Aposta selecionada: ${apostaSelecionada}`;
  });
});

// --- Animar bola ---
function animarBola(finalIndex){
  const duracao = 5000;
  const start = performance.now();
  const totalVoltas = 5;

  function frame(time){
    let t = (time - start)/duracao;
    if(t>1) t=1;
    const ease = 1 - Math.pow(1-t,3); // desaceleração

    const totalAngulo = totalVoltas*2*Math.PI + (finalIndex/total)*2*Math.PI;
    const angleBola = ease*totalAngulo;

    const x = 150 + bolaRadius * Math.cos(-angleBola + Math.PI/2);
    const y = 150 + bolaRadius * Math.sin(-angleBola + Math.PI/2);
    bola.style.left = `${x-7}px`;
    bola.style.top = `${y-7}px`;

    if(t<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Girar roleta ---
document.getElementById("roleta-spin").addEventListener("click", async ()=>{
  const user = auth.currentUser;
  if(!user) return alert("Você precisa estar logado!");
  if(!apostaSelecionada) return alert("Selecione uma aposta!");

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()) return alert("Documento do usuário não encontrado!");

  let saldo = docSnap.data().saldo;
  const valorAposta = 50;
  if(saldo<valorAposta) return alert("Saldo insuficiente!");
  saldo -= valorAposta;
  atualizarSaldo(user.uid, saldo);

  // Resultado aleatório
  const resultadoIndex = Math.floor(Math.random()*total);
  const resultado = numeros[resultadoIndex];

  // Girar roleta visual
  const totalGiros = 360*5 + (resultadoIndex/total)*360;
  roletaVisual.style.transition = "transform 5s cubic-bezier(0.33,1,0.68,1)";
  roletaVisual.style.transform = `rotate(${totalGiros}deg)`;

  // Animar bola
  animarBola(resultadoIndex);

  setTimeout(async ()=>{
    const ganhou = apostaSelecionada==resultado.num || apostaSelecionada==resultado.cor;
    if(ganhou) saldo += valorAposta*2;
    atualizarSaldo(user.uid, saldo);

    document.getElementById("roleta-resultado").textContent = `Resultado: ${resultado.num} (${resultado.cor}) - Você ${ganhou?"ganhou!":"perdeu!"}`;

    // Reset roleta
    roletaVisual.style.transition="none";
    roletaVisual.style.transform="rotate(0deg)";
  },5000);
});
