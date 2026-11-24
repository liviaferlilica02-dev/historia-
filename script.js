/* =========================================================
   Correspondências da Belle Époque — script.js
   Envelope, navegação, galeria, investigação, caça-palavras, quiz
   ========================================================= */

/* ---------- 1. ENVELOPE ---------- */
const entrada = document.getElementById('entrada');
const arquivo = document.getElementById('arquivo');
const envelope = document.getElementById('envelope');
let abrindo = false;

function abrirCorrespondencia() {
  if (abrindo) return;
  abrindo = true;
  envelope.classList.add('aberto');
  setTimeout(() => entrada.classList.add('saindo'), 2200);
  setTimeout(() => {
    entrada.classList.add('oculto');
    arquivo.classList.remove('oculto');
    irPara('indice');
    abrindo = false;
  }, 3100);
}
document.getElementById('selo').addEventListener('click', abrirCorrespondencia);
document.getElementById('btnAbrir').addEventListener('click', abrirCorrespondencia);

document.getElementById('btnReler').addEventListener('click', () => {
  arquivo.classList.add('oculto');
  envelope.classList.remove('aberto');
  entrada.classList.remove('oculto', 'saindo');
  window.scrollTo({ top: 0 });
});

/* ---------- 2. NAVEGAÇÃO ENTRE SEÇÕES ---------- */
function irPara(id) {
  document.querySelectorAll('.pagina').forEach(p => p.classList.toggle('ativa', p.id === id));
  document.querySelectorAll('.topo-nav button').forEach(b => b.classList.toggle('atual', b.dataset.ir === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id !== 'encerramento') {
    const v = document.getElementById('videoFinal');
    if (v && !v.paused) v.pause();
  }
}
document.addEventListener('click', e => {
  const alvo = e.target.closest('[data-ir]');
  if (alvo) irPara(alvo.dataset.ir);
});

/* ---------- 3. GALERIA ---------- */
const obras = [
  {
    titulo: 'Bal du moulin de la Galette',
    ano: '1876',
    imagem: 'imagens/pintura-principal.jpg',
    meta: 'Óleo sobre tela · Musée d’Orsay, Paris',
    desc: 'Nossa obra principal. Retrata um baile popular em Montmartre, com pessoas dançando e conversando sob a luz filtrada pelas árvores.',
    curiosidades: [
      'O baile acontecia ao ar livre, em um moinho de Montmartre, e reunia pessoas de diferentes ocupações aos domingos.',
      'As manchas de luz que atravessam as folhagens e caem sobre as roupas são uma marca do Impressionismo.',
      'A obra ajuda a compreender a vida parisiense e as transformações artísticas que antecederam a Belle Époque.'
    ]
  },
  {
    titulo: 'The Swing (La Balançoire)',
    ano: '1876',
    imagem: 'imagens/outras-obras/the-swing.jpg',
    meta: 'Óleo sobre tela · Musée d’Orsay, Paris',
    desc: 'Uma cena cotidiana ao ar livre, com pessoas em um jardim.',
    curiosidades: [
      'Assim como no baile de Montmartre, a luz forma manchas coloridas sobre o vestido e o chão.',
      'Foi pintada no mesmo ano de Bal du moulin de la Galette, e as duas obras dialogam pelo tema do lazer.',
      'Repare como os contornos são suaves: as figuras quase se misturam ao jardim.'
    ]
  },
  {
    titulo: 'Dance in the City (Danse à la ville)',
    ano: '1883',
    imagem: 'imagens/outras-obras/dance-in-the-city.jpg',
    meta: 'Óleo sobre tela · Musée d’Orsay, Paris',
    desc: 'Uma representação de um casal dançando.',
    curiosidades: [
      'É uma obra mais tardia que as outras duas e mostra um baile de salão, em ambiente elegante.',
      'Tem uma obra “irmã”, Dance in the Country, que mostra um casal dançando ao ar livre.',
      'Compare as roupas e os gestos com os do baile popular de Montmartre: o que muda?'
    ]
  }
];

const galeriaGrade = document.getElementById('galeriaGrade');
obras.forEach((o, i) => {
  const b = document.createElement('button');
  b.className = 'obra';
  b.innerHTML = `
    <div class="moldura-obra"><img src="${o.imagem}" alt="${o.titulo}"><span class="legenda-falta">${o.titulo}<br><small>${o.imagem}</small></span></div>
    <h3>${o.titulo}</h3><small>${o.ano}</small><span class="ver">Abrir ficha</span>`;
  const img = b.querySelector('img');
  img.addEventListener('error', () => b.querySelector('.moldura-obra').classList.add('sem-imagem'));
  b.addEventListener('click', () => abrirModal(i));
  galeriaGrade.appendChild(b);
});

const modal = document.getElementById('modal');
function abrirModal(i) {
  const o = obras[i];
  const mi = document.getElementById('modalImg');
  mi.classList.remove('sem-imagem');
  mi.innerHTML = `<img src="${o.imagem}" alt="${o.titulo}"><span class="legenda-falta">${o.titulo}<br><small>${o.imagem}</small></span>`;
  mi.querySelector('img').addEventListener('error', () => mi.classList.add('sem-imagem'));
  document.getElementById('modalTitulo').textContent = o.titulo;
  document.getElementById('modalMeta').textContent = `${o.ano} · ${o.meta}`;
  document.getElementById('modalDesc').textContent = o.desc;
  document.getElementById('modalCuriosidades').innerHTML = o.curiosidades.map(c => `<li>${c}</li>`).join('');
  modal.hidden = false;
}
function fecharModal() { modal.hidden = true; }
document.getElementById('modalFechar').addEventListener('click', fecharModal);
modal.addEventListener('click', e => { if (e.target === modal) fecharModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

/* ---------- 4. INVESTIGAÇÃO ---------- */
const pistas = [
  { t: 'Um baile ao ar livre', d: 'A cena mostra pessoas dançando, conversando e se divertindo em um baile popular de Montmartre, em Paris.' },
  { t: 'Luz filtrada', d: 'Observe as manchas claras no chão e nas roupas: é a luz do sol passando pelas folhas. Capturar a luz é uma característica do Impressionismo.' },
  { t: 'Pinceladas soltas', d: 'Renoir não desenhou contornos rígidos. As pinceladas curtas e coloridas dão sensação de movimento e vida.' },
  { t: 'Lazer e convivência', d: 'A cena revela que encontros sociais, música e dança faziam parte do lazer das pessoas em Paris naquela época.' }
];
const caixaPista = document.getElementById('caixaPista');
document.querySelectorAll('.ponto').forEach(p => {
  p.addEventListener('click', () => {
    const x = pistas[+p.dataset.i];
    caixaPista.innerHTML = `<h3>Pista ${+p.dataset.i + 1}: ${x.t}</h3><p>${x.d}</p>`;
    p.classList.add('visto');
  });
});

const perguntasInvest = [
  { q: 'O que as pessoas estão fazendo?', r: 'Dançando, conversando, sentadas em mesas e aproveitando um baile ao ar livre.' },
  { q: 'Quais cores aparecem com mais destaque?', r: 'Tons de azul e de branco nas roupas, contrastando com verdes, amarelos e marrons do ambiente.' },
  { q: 'Como a luz aparece na pintura?', r: 'Em manchas claras que atravessam as árvores e caem sobre as pessoas e o chão.' },
  { q: 'Que tipos de roupas podemos observar?', r: 'Vestidos longos e leves, chapéus, casacas e paletós: roupas de passeio da época.' },
  { q: 'O que essa cena revela sobre o lazer naquela época?', r: 'Que dançar, conversar e se encontrar em espaços públicos era uma forma importante de diversão em Paris.' }
];
const boxPerg = document.getElementById('perguntasInvest');
perguntasInvest.forEach((p, i) => {
  const d = document.createElement('details');
  d.className = 'pergunta';
  d.innerHTML = `
    <summary>${i + 1}. ${p.q}</summary>
    <textarea rows="2" placeholder="Escreva aqui o que você observou..."></textarea>
    <button class="botao pequeno" type="button">Ver resposta sugerida</button>
    <p class="dica-resp" hidden>${p.r}</p>`;
  d.querySelector('button').addEventListener('click', () => {
    d.querySelector('.dica-resp').hidden = false;
  });
  boxPerg.appendChild(d);
});

/* ---------- 5. CAÇA-PALAVRAS ---------- */
const PALAVRAS = ['IMPRESSIONISMO', 'RENOIR', 'PARIS', 'ARTE', 'CULTURA', 'TECNOLOGIA', 'BELLEEPOQUE'];
const TAM = 14;
const DIRS = [[0, 1], [1, 0], [1, 1]]; // direita, baixo, diagonal

function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296; }

function gerarGrade() {
  const rand = rng(1876);
  const g = Array.from({ length: TAM }, () => Array(TAM).fill(''));
  const ordem = [...PALAVRAS].sort((a, b) => b.length - a.length);
  for (const w of ordem) {
    let ok = false;
    for (let t = 0; t < 600 && !ok; t++) {
      const [dl, dc] = DIRS[Math.floor(rand() * DIRS.length)];
      const l = Math.floor(rand() * TAM), c = Math.floor(rand() * TAM);
      const fl = l + dl * (w.length - 1), fc = c + dc * (w.length - 1);
      if (fl >= TAM || fc >= TAM) continue;
      let cabe = true;
      for (let k = 0; k < w.length; k++) {
        const cel = g[l + dl * k][c + dc * k];
        if (cel && cel !== w[k]) { cabe = false; break; }
      }
      if (!cabe) continue;
      for (let k = 0; k < w.length; k++) g[l + dl * k][c + dc * k] = w[k];
      ok = true;
    }
    if (!ok) return gerarGrade2(); // não deve ocorrer
  }
  const letras = 'ABCDEFGHIJLMNOPQRSTUVX';
  for (let l = 0; l < TAM; l++) for (let c = 0; c < TAM; c++)
    if (!g[l][c]) g[l][c] = letras[Math.floor(rand() * letras.length)];
  return g;
}
function gerarGrade2() { return gerarGrade(); }

let grade, achadas, inicio;
const cacaGrade = document.getElementById('cacaGrade');
const cacaLista = document.getElementById('cacaLista');

function montarCaca() {
  grade = gerarGrade();
  achadas = new Set();
  inicio = null;
  cacaGrade.style.gridTemplateColumns = `repeat(${TAM}, auto)`;
  cacaGrade.innerHTML = '';
  for (let l = 0; l < TAM; l++) for (let c = 0; c < TAM; c++) {
    const b = document.createElement('button');
    b.className = 'celula';
    b.textContent = grade[l][c];
    b.dataset.l = l; b.dataset.c = c;
    b.addEventListener('click', () => clicarCelula(l, c, b));
    cacaGrade.appendChild(b);
  }
  cacaLista.innerHTML = PALAVRAS.map(p => `<li data-p="${p}">${p}</li>`).join('');
  atualizarProgresso();
  document.getElementById('cacaFim').hidden = true;
}
function celula(l, c) { return cacaGrade.children[l * TAM + c]; }

function clicarCelula(l, c, el) {
  if (!inicio) {
    inicio = { l, c };
    el.classList.add('inicio');
    return;
  }
  const { l: l0, c: c0 } = inicio;
  celula(l0, c0).classList.remove('inicio');
  inicio = null;
  const dl = l - l0, dc = c - c0;
  const n = Math.max(Math.abs(dl), Math.abs(dc));
  if (n === 0 || !(dl === 0 || dc === 0 || Math.abs(dl) === Math.abs(dc))) return tremer(el);
  const sl = Math.sign(dl), sc = Math.sign(dc);
  let txt = '';
  const pos = [];
  for (let k = 0; k <= n; k++) { txt += grade[l0 + sl * k][c0 + sc * k]; pos.push([l0 + sl * k, c0 + sc * k]); }
  const rev = [...txt].reverse().join('');
  const achou = PALAVRAS.find(p => p === txt || p === rev);
  if (achou && !achadas.has(achou)) {
    achadas.add(achou);
    pos.forEach(([a, b]) => celula(a, b).classList.add('achada'));
    cacaLista.querySelector(`[data-p="${achou}"]`).classList.add('achada');
    atualizarProgresso();
  } else tremer(el);
}
function tremer(el) {
  el.classList.add('erro');
  setTimeout(() => el.classList.remove('erro'), 350);
}
function atualizarProgresso() {
  const n = achadas.size;
  document.getElementById('contadorCaca').textContent = `${n} / ${PALAVRAS.length} palavras`;
  document.getElementById('barraCaca').style.width = `${(n / PALAVRAS.length) * 100}%`;
  if (n === PALAVRAS.length) document.getElementById('cacaFim').hidden = false;
}
document.getElementById('cacaReiniciar').addEventListener('click', montarCaca);
montarCaca();

/* ---------- 6. QUIZ ---------- */
const perguntasQuiz = [
  {
    q: 'Qual movimento artístico está associado a Renoir?',
    o: ['Cubismo', 'Impressionismo', 'Surrealismo', 'Barroco'], c: 1,
    e: 'Renoir foi um dos artistas importantes para o desenvolvimento do Impressionismo.'
  },
  {
    q: 'Em que ano Renoir pintou Bal du moulin de la Galette?',
    o: ['1850', '1860', '1876', '1900'], c: 2,
    e: 'A obra é de 1876, anterior à Belle Époque em sua delimitação mais comum.'
  },
  {
    q: 'O que significa a expressão francesa “Belle Époque”?',
    o: ['Grande Revolução', 'Bela Época', 'Nova Cidade', 'Tempo de Guerra'], c: 1,
    e: 'Belle Époque significa “Bela Época”.'
  },
  {
    q: 'Qual cidade é o grande símbolo da Belle Époque?',
    o: ['Paris', 'Roma', 'Madri', 'Lisboa'], c: 0,
    e: 'Paris passou por grandes transformações em tecnologia, entretenimento e arte.'
  },
  {
    q: 'Qual evento marca o fim da Belle Époque?',
    o: ['A Revolução Francesa', 'A invenção do cinema', 'O início da Primeira Guerra Mundial', 'A Exposição Universal'], c: 2,
    e: 'O período vai até 1914, com o início da Primeira Guerra Mundial.'
  }
];
const quizCaixa = document.getElementById('quizCaixa');
let qi = 0, pontos = 0;

function mostrarQuiz() {
  const p = perguntasQuiz[qi];
  quizCaixa.innerHTML = `
    <div class="quiz-topo"><span>Pergunta ${qi + 1} de ${perguntasQuiz.length}</span><span>Acertos: ${pontos}</span></div>
    <div class="progresso"><div class="barra"><span style="width:${(qi / perguntasQuiz.length) * 100}%"></span></div></div>
    <p class="quiz-pergunta">${p.q}</p>
    <div class="opcoes">${p.o.map((t, i) => `<button class="opcao" data-i="${i}"><strong>${'ABCD'[i]})</strong> ${t}</button>`).join('')}</div>
    <div id="quizExp"></div>`;
  quizCaixa.querySelectorAll('.opcao').forEach(b => b.addEventListener('click', () => responder(+b.dataset.i)));
}
function responder(i) {
  const p = perguntasQuiz[qi];
  const botoes = quizCaixa.querySelectorAll('.opcao');
  botoes.forEach(b => b.disabled = true);
  botoes[p.c].classList.add('certa');
  const acertou = i === p.c;
  if (acertou) pontos++; else botoes[i].classList.add('errada');
  const ultima = qi === perguntasQuiz.length - 1;
  document.getElementById('quizExp').innerHTML = `
    <div class="explica"><strong>${acertou ? '✔ Correto!' : '✘ Não foi dessa vez.'}</strong> ${p.e}</div>
    <div class="quiz-acoes"><button class="botao" id="quizProx">${ultima ? 'Ver resultado' : 'Próxima pergunta →'}</button></div>`;
  document.getElementById('quizProx').addEventListener('click', () => { qi++; ultima ? mostrarResultado() : mostrarQuiz(); });
}
function mostrarResultado() {
  const total = perguntasQuiz.length;
  const estrelas = pontos >= total - 0 ? 3 : pontos >= total - 2 ? 2 : pontos >= 1 ? 1 : 0;
  const msg = pontos === total
    ? 'Excelente! Você é um verdadeiro historiador da Belle Époque!'
    : pontos >= 3 ? 'Muito bem! Você aprendeu bastante nesta viagem pela história.'
    : 'Boa tentativa! Releia os documentos do arquivo e tente novamente.';
  quizCaixa.innerHTML = `
    <div class="resultado">
      <p class="sobretitulo">Resultado final</p>
      <p class="pontos">${pontos} / ${total}</p>
      <p class="estrelas">${'★'.repeat(estrelas)}${'☆'.repeat(3 - estrelas)}</p>
      <p class="destaque" style="text-align:left">${msg}</p>
      <button class="botao" id="quizRefazer">↻ Jogar novamente</button>
    </div>`;
  document.getElementById('quizRefazer').addEventListener('click', () => { qi = 0; pontos = 0; mostrarQuiz(); });
}
mostrarQuiz();

/* ---------- 7. VÍDEO FINAL ---------- */
(function () {
  const v = document.getElementById('videoFinal');
  const caixa = v.closest('.video-caixa');
  const src = v.querySelector('source');
  const falhou = () => caixa.classList.add('sem-video');
  src.addEventListener('error', falhou);
  v.addEventListener('error', falhou);
  v.addEventListener('loadeddata', () => caixa.classList.remove('sem-video'));
})();
