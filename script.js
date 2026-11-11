// ============================================================
// CONFIGURAÇÃO — é só preencher entre as aspas.
// checkoutUrl: link da página de pagamento. Vazio = os botões de compra levam à seção de preço.
// videoUrl:    link de um arquivo .mp4 do vídeo da Luisa. Vazio = o hero mostra só a foto.
// ============================================================
const CONFIG = {
  checkoutUrl: "",
  videoUrl: "",
};

// Botões de compra
if (CONFIG.checkoutUrl) {
  document.querySelectorAll("[data-checkout]").forEach((a) => {
    a.href = CONFIG.checkoutUrl;
  });
}

// Vídeo do hero: o botão "Assistir ao vídeo" abre o vídeo por cima da página
const play = document.getElementById("play");
if (CONFIG.videoUrl) {
  play.hidden = false;
  play.addEventListener("click", () => {
    const d = document.createElement("dialog");
    d.className = "video-modal";
    const v = document.createElement("video");
    v.src = CONFIG.videoUrl;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    const fechar = document.createElement("button");
    fechar.setAttribute("aria-label", "Fechar vídeo");
    fechar.textContent = "×";
    d.append(v, fechar);
    document.body.append(d);
    d.showModal();
    fechar.addEventListener("click", () => d.close());
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
    d.addEventListener("close", () => d.remove());
  });
}

// Menu mobile
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
const fecharMenu = () => {
  nav.classList.remove("aberto");
  menuBtn.setAttribute("aria-expanded", "false");
};
menuBtn.addEventListener("click", () => {
  const aberto = nav.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", String(aberto));
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) fecharMenu();
});

// "Ler mais" da bio (mobile)
const lerMais = document.getElementById("ler-mais");
lerMais.addEventListener("click", () => {
  document.getElementById("bio-mais").classList.add("aberto");
  lerMais.setAttribute("aria-expanded", "true");
  lerMais.hidden = true;
});

// Transição entre seções: rolagem normal. Cada seção entra como uma "folha" de cantos
// arredondados por cima do fim da anterior (feito só em CSS), sem prender nem cobrir o texto.
const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const posicaoReal = (alvo) => alvo.getBoundingClientRect().top + scrollY;
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);
  const alvo = id ? document.getElementById(id) : null;
  if (id && !alvo) return;
  e.preventDefault();
  scrollTo({ top: alvo ? posicaoReal(alvo) : 0, behavior: semMovimento ? "auto" : "smooth" });
});

// CTA fixo (mobile): aparece depois do hero, some enquanto a seção de preço está na tela
// e enquanto algum botão da própria página está visível (para não ficarem dois botões iguais)
const ctasNaTela = new Set();
const ctaFixo = document.getElementById("cta-fixo");
const preco = document.getElementById("investimento");
const heroTexto = document.querySelector(".hero__texto");
let agendado = false;
const atualizarCta = () => {
  agendado = false;
  const fimHero = posicaoReal(heroTexto) + heroTexto.offsetHeight;
  const topoPreco = posicaoReal(preco);
  const noPreco = scrollY + innerHeight > topoPreco + 120 && scrollY < topoPreco + preco.offsetHeight - 120;
  const visivel = scrollY > fimHero && !noPreco && !ctasNaTela.size;
  ctaFixo.classList.toggle("visivel", visivel);
  ctaFixo.setAttribute("aria-hidden", String(!visivel));
  ctaFixo.querySelector("a").tabIndex = visivel ? 0 : -1;
};
addEventListener("scroll", () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizarCta); } }, { passive: true });
atualizarCta();
if ("IntersectionObserver" in window) {
  const ioCtas = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? ctasNaTela.add(e.target) : ctasNaTela.delete(e.target)));
    atualizarCta();
  });
  document.querySelectorAll("main .btn, .rodape").forEach((b) => ioCtas.observe(b));
}

// Módulos: a imagem ao lado acompanha o módulo sob o cursor (desktop)
const modulos = [...document.querySelectorAll(".modulo")];
const painel = [...document.querySelectorAll(".modulos__painel > *")];
const ativarModulo = (n) => {
  painel.forEach((p) => p.classList.toggle("on", p.dataset.mod === n));
  modulos.forEach((m) => m.classList.toggle("on", m.dataset.mod === n));
};
modulos.forEach((m) => m.addEventListener("mouseenter", () => ativarModulo(m.dataset.mod)));
ativarModulo("1");

// Mobile: sem mouse, o destaque acompanha a rolagem. Acende o módulo e os ícones que passam pelo meio da tela.
if ("IntersectionObserver" in window && matchMedia("(max-width: 959px)").matches) {
  const faixa = { rootMargin: "-42% 0px -42% 0px" };
  const lista = document.querySelector(".modulos__lista");
  const ioModulos = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { ativarModulo(e.target.dataset.mod); lista.classList.add("foco"); } });
  }, faixa);
  modulos.forEach((m) => ioModulos.observe(m));
  const ioItens = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting || (e.rootBounds && e.boundingClientRect.top < e.rootBounds.top)) { e.target.classList.add("aceso"); ioItens.unobserve(e.target); } });
  }, { rootMargin: "-30% 0px -30% 0px" });
  document.querySelectorAll(".itens li, .guinada__lista li").forEach((li) => ioItens.observe(li));
  // o iPhone só mostra o estado "pressionado" dos botões se existir um ouvinte de toque
  document.addEventListener("touchstart", () => {}, { passive: true });
}

// Entrada suave dos blocos conforme a página rola
if (document.documentElement.classList.contains("js")) {
  const alvos = document.querySelectorAll(
    "main .wrap > *, .hero__texto > *, .stat, .tipos li, .itens li, .guinada__lista li, .perfil li, .modulo, .depo__card, .quem__painel, .recibo dl div, .faq details, .escolhas li"
  );
  alvos.forEach((el) => {
    el.setAttribute("data-r", "");
    const irmaos = [...el.parentElement.children];
    el.style.setProperty("--d", Math.min(irmaos.indexOf(el), 6) * 70 + "ms");
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    alvos.forEach((el) => io.observe(el));
    // Rede de segurança: o que já está na tela aparece mesmo se o observador atrasar
    setTimeout(() => alvos.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); }), 1500);
  } else {
    alvos.forEach((el) => el.classList.add("in"));
  }
}

// Quebras de linha: une as duas últimas palavras de cada título ou bloco de texto,
// para nunca sobrar uma palavra sozinha na última linha.
document.querySelectorAll("h1, h2, h3, p, li, summary, blockquote, dt").forEach((el) => {
  if (el.querySelector("p, li, h1, h2, h3, blockquote, ol, ul, div")) return;
  if (el.textContent.trim().split(/\s+/).length < 4) return;
  const andar = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let ultimo = null;
  while (andar.nextNode()) if (andar.currentNode.nodeValue.trim()) ultimo = andar.currentNode;
  if (!ultimo) return;
  const texto = ultimo.nodeValue.replace(/\s+$/, "");
  const i = texto.lastIndexOf(" ");
  if (i > 0) ultimo.nodeValue = texto.slice(0, i) + "\u00A0" + texto.slice(i + 1);
});

// Capa: separa o título em palavras para a entrada palavra por palavra (o estilo fica no CSS)
(() => {
  const titulo = document.querySelector(".hero .h1");
  if (!titulo) return;
  let i = 0;
  const andar = document.createTreeWalker(titulo, NodeFilter.SHOW_TEXT);
  const nos = [];
  while (andar.nextNode()) nos.push(andar.currentNode);
  nos.forEach((no) => {
    const frag = document.createDocumentFragment();
    no.nodeValue.split(/(\s+)/).forEach((parte) => {
      if (!parte) return;
      if (/^\s+$/.test(parte)) { frag.append(parte); return; }
      const s = document.createElement("span");
      s.className = "pal";
      s.style.setProperty("--i", i++);
      s.textContent = parte;
      frag.append(s);
    });
    no.replaceWith(frag);
  });
})();

// Guinada: quando a lista aparece, os ✕ giram um a um (uma vez só)
(() => {
  const lista = document.querySelector(".guinada__lista");
  if (!lista || !("IntersectionObserver" in window)) return;
  [...lista.children].forEach((li, i) => li.style.setProperty("--n", i));
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { lista.classList.add("vira"); io.disconnect(); }
  }, { rootMargin: "0px 0px -25% 0px" });
  io.observe(lista);
})();

// Pra quem é: cada item acende quando passa pelo meio da tela (desktop e mobile)
(() => {
  const itens = document.querySelectorAll(".perfil li");
  if (!itens.length) return;
  if (!("IntersectionObserver" in window)) { itens.forEach((li) => li.classList.add("aceso")); return; }
  const io = new IntersectionObserver((es) => {
    // acende ao passar pelo meio da tela, ou se a rolagem rápida já o deixou para trás
    es.forEach((e) => { if (e.isIntersecting || (e.rootBounds && e.boundingClientRect.top < e.rootBounds.top)) { e.target.classList.add("aceso"); io.unobserve(e.target); } });
  }, { rootMargin: "-35% 0px -35% 0px" });
  itens.forEach((li) => io.observe(li));
})();

// Preço: a parcela conta até o valor final quando aparece; depois "a conta" se resolve no bloco vinho.
(() => {
  const sec = document.getElementById("investimento");
  const num = sec && sec.querySelector(".preco .num");
  if (!num || !("IntersectionObserver" in window)) return;
  const final = num.textContent;
  const prefixo = final.match(/^[^\d]*/)[0];
  const alvo = parseFloat(final.replace(/[^\d,]/g, "").replace(",", "."));
  const formata = (v) => prefixo + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const conta = sec.querySelector(".invest__conta");

  // holofote: a seção escurece de leve nas bordas enquanto o preço está no centro da tela
  const ioFoco = new IntersectionObserver((es) => es.forEach((e) => sec.classList.toggle("foco", e.isIntersecting)), { rootMargin: "-30% 0px -30% 0px" });
  ioFoco.observe(sec.querySelector(".invest"));

  if (semMovimento) { sec.classList.add("conta-on"); return; }

  const rodar = () => {
    const de = alvo * 4, dur = 1600, t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      num.textContent = p < 1 ? formata(de + (alvo - de) * e) : final;
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    rodar();
  }, { rootMargin: "0px 0px -30% 0px" });
  io.observe(num);
  if (conta) {
    const ioConta = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { ioConta.disconnect(); setTimeout(() => sec.classList.add("conta-on"), 600); }
    }, { rootMargin: "0px 0px -30% 0px" });
    ioConta.observe(conta);
    if (matchMedia("(hover: hover) and (min-width: 960px)").matches) {
      conta.addEventListener("pointermove", (ev) => {
        const r = conta.getBoundingClientRect();
        conta.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
        conta.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
      });
    }
  }
})();

// Depoimentos em vídeo: o play inicia o vídeo com os controles; tocar um pausa os outros
(() => {
  const telas = [...document.querySelectorAll(".depo__tela")];
  const videos = telas.map((t) => t.querySelector("video"));
  telas.forEach((tela, i) => {
    const v = videos[i];
    tela.querySelector(".depo__play").addEventListener("click", () => { v.controls = true; v.play(); });
    v.addEventListener("play", () => { tela.classList.add("tocando"); videos.forEach((o) => { if (o !== v && !o.paused) o.pause(); }); });
    v.addEventListener("ended", () => { tela.classList.remove("tocando"); v.controls = false; v.load(); });
  });
})();

// Carrosséis (antes e depois, depoimentos): setas, indicador e arrastar
document.querySelectorAll("[data-carrossel]").forEach((trilho) => {
  const nav = trilho.parentElement.querySelector(".car-nav");
  if (!nav) return;
  const itens = [...trilho.children];
  const pontos = [...nav.querySelectorAll(".car-pontos i")];
  const [ant, prox] = nav.querySelectorAll(".car-seta");
  const passo = () => itens[0].offsetWidth + parseFloat(getComputedStyle(trilho).columnGap || 0);
  const maxPasso = () => Math.round((trilho.scrollWidth - trilho.clientWidth) / passo());
  const atualizar = () => {
    const i = Math.round(trilho.scrollLeft / passo());
    const fim = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
    const visiveis = Math.max(1, itens.length - maxPasso());
    pontos.forEach((p, n) => p.classList.toggle("on", fim ? n >= itens.length - visiveis : n >= i && n < i + visiveis));
    ant.disabled = trilho.scrollLeft <= 4;
    prox.disabled = fim;
  };
  // cada clique anda exatamente um item, mesmo com a rolagem anterior ainda em andamento
  let alvo = null;
  ["pointerdown", "wheel", "touchstart", "scrollend"].forEach((ev) => trilho.addEventListener(ev, () => { alvo = null; }, { passive: true }));
  [ant, prox].forEach((b) => b.addEventListener("click", () => {
    const max = maxPasso();
    const base = alvo ?? Math.round(trilho.scrollLeft / passo());
    alvo = Math.min(max, Math.max(0, base + Number(b.dataset.dir)));
    trilho.scrollTo({ left: alvo * passo(), behavior: semMovimento ? "auto" : "smooth" });
    ant.disabled = alvo <= 0; prox.disabled = alvo >= max;
  }));
  trilho.addEventListener("scroll", () => requestAnimationFrame(atualizar), { passive: true });
  addEventListener("resize", atualizar);
  atualizar();
});
