/* ============================================================
   HIT MUSIC BUSINESS — main.js
   Stack: Vite + GSAP + ScrollTrigger + Lenis + SplitType
============================================================ */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'

// Registrar plugins GSAP
gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   1. LENIS — SMOOTH SCROLL
============================================================ */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
})

// Conectar Lenis ao GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

/* ============================================================
   2. CURSOR CUSTOMIZADO
============================================================ */
const cursor = document.getElementById('cursor')
const cursorFollower = document.getElementById('cursorFollower')

let mouseX = 0, mouseY = 0
let followerX = 0, followerY = 0

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY

  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.1,
    ease: 'power2.out',
  })
})

// Follower com lag (inércia)
gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.12
  followerY += (mouseY - followerY) * 0.12

  gsap.set(cursorFollower, { x: followerX, y: followerY })
})

// Hover em links e botões
const hoverTargets = document.querySelectorAll('a, button, .ecossistema__card, .simulador__option, .portfolio__case')

hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor--hover'))
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor--hover'))
})

/* ============================================================
   3. LOADER ÉPICO
============================================================ */
;(function initEpicLoader() {
  // Fallback de segurança: se algo falhar, hero ainda inicializa
  const safetyTimer = setTimeout(() => {
    const l = document.getElementById('loader')
    if (l && l.style.display !== 'none') {
      l.style.display = 'none'
      initHeroAnimation()
    }
  }, 9000)

  try {

  const loader         = document.getElementById('loader')
  const loaderEq       = document.getElementById('loaderEq')
  const loaderLogo     = document.getElementById('loaderLogo')
  const loaderLogoWrap = document.getElementById('loaderLogoWrap')
  const loaderBarFill  = document.getElementById('loaderBarFill')
  const loaderBarHead  = document.getElementById('loaderBarHead')
  const loaderPct      = document.getElementById('loaderPct')
  const loaderStage    = document.getElementById('loaderStage')
  const curtainTop     = document.getElementById('loaderCurtainTop')
  const curtainBot     = document.getElementById('loaderCurtainBot')
  const progressWrap   = loader.querySelector('.loader__progress-wrap')
  const tagline        = loader.querySelector('.loader__tagline')
  const glow           = loader.querySelector('.loader__logo-glow')
  const sweep          = loader.querySelector('.loader__logo-sweep')

  // ── 1. Gerar barras do equalizador ──────────────────────────
  const BAR_COUNT = 72
  const bars = []

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div')
    bar.className = 'loader__eq-bar'
    const baseH = 8 + Math.random() * 18   // altura base %
    bar.style.height = baseH + '%'
    loaderEq.appendChild(bar)
    bars.push({ el: bar, base: baseH })
  }

  // Equalizador vivo — cada barra anima no seu próprio ritmo
  const eqTimelines = bars.map((b, i) => {
    const speed   = 0.3 + Math.random() * 0.7
    const maxH    = 20  + Math.random() * 55  // pico em %
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: Math.random() * 1.5 })
    tl.to(b.el, {
      height: maxH + '%',
      duration: speed,
      ease: 'sine.inOut',
    })
    return tl
  })

  // ── 2. Sequência de entrada ──────────────────────────────────
  const introTl = gsap.timeline()

  // Logo entra
  introTl
    .to(loaderLogo, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: 'expo.out',
      delay: 0.2,
    })
    // Glow aparece junto
    .to(glow, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '<0.3')
    // Light sweep: parte da esquerda, cruza, some à direita
    .set(sweep, { opacity: 1, xPercent: -120 })
    .to(sweep, {
      xPercent: 240,
      duration: 0.75,
      ease: 'power2.inOut',
    })
    .set(sweep, { opacity: 0 })
    // Barra de progresso e tagline aparecem
    .to(progressWrap, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    .to(tagline,      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<0.1')

  // ── 3. Progresso simulado ────────────────────────────────────
  let pct = 0
  let done = false

  // Velocidade variável: arranca rápido, desacelera no meio, acelera no fim
  const speeds = [
    { until: 30,  step: () => 4 + Math.random() * 8  },
    { until: 65,  step: () => 1.5 + Math.random() * 4 },
    { until: 88,  step: () => 0.5 + Math.random() * 2 },
    { until: 100, step: () => 2 + Math.random() * 5  },
  ]

  function getStep(p) {
    for (const s of speeds) {
      if (p < s.until) return s.step()
    }
    return 3
  }

  function tick() {
    if (done) return
    const step = getStep(pct)
    pct = Math.min(100, pct + step)

    // Atualiza barra + cabeça
    loaderBarFill.style.width = pct + '%'
    loaderBarHead.style.left  = pct + '%'
    loaderPct.textContent     = Math.floor(pct) + '%'

    // Barras do EQ ficam mais intensas conforme carrega
    const intensity = pct / 100
    eqTimelines.forEach(tl => tl.timeScale(0.5 + intensity * 1.8))

    if (pct >= 100) {
      done = true
      loaderPct.classList.add('loader__pct--ready')
      loaderPct.textContent = '100%'
      setTimeout(blastAndExit, 420)
      return
    }

    const delay = 80 + (pct > 65 && pct < 88 ? 60 : 0) + Math.random() * 60
    setTimeout(tick, delay)
  }

  // Inicia o progresso depois que o logo aparece
  setTimeout(tick, 1200)

  // ── 4. Saída épica ───────────────────────────────────────────
  function blastAndExit() {
    clearTimeout(safetyTimer)
    const exitTl = gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none'
        initHeroAnimation()   // chamada direta no scope do módulo (não window)
      }
    })

    // Fase 1: barras do EQ disparam para cima (blast)
    exitTl
      .to(bars.map(b => b.el), {
        height: '100%',
        duration: 0.35,
        ease: 'expo.in',
        stagger: { amount: 0.12, from: 'center' },
      })

    // Fase 2: flash branco no logo
      .to(loaderLogo, {
        filter: 'brightness(4) saturate(0)',
        duration: 0.15,
        ease: 'power4.in',
      }, '-=0.1')

    // Fase 3: logo e stage saem
      .to(loaderStage, {
        scale: 1.08,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
      }, '-=0.05')

    // Fase 4: cortinas se afastam revelando o hero
      .to(curtainTop, {
        yPercent: -100,
        duration: 0.7,
        ease: 'expo.inOut',
      }, '-=0.1')
      .to(curtainBot, {
        yPercent: 100,
        duration: 0.7,
        ease: 'expo.inOut',
      }, '<')

    // EQ desaparece junto com cortinas
      .to(loaderEq, {
        opacity: 0,
        duration: 0.3,
      }, '<0.2')
  }

  } catch (err) {
    console.error('[HIT Loader] Erro no loader:', err)
    clearTimeout(safetyTimer)
    const l = document.getElementById('loader')
    if (l) l.style.display = 'none'
    initHeroAnimation()
  }

})()

// initHeroAnimation é function declaration — acessível globalmente

/* ============================================================
   4. HERO — ANIMAÇÃO DE ENTRADA
============================================================ */
function initHeroAnimation() {
  // GSAP define os estados iniciais (não o CSS, para evitar conflito de unidades)
  gsap.set('.hero__title .line-inner', { yPercent: 110 })
  gsap.set('.hero__eyebrow',     { opacity: 0, y: 20 })
  gsap.set('.hero__sub',         { opacity: 0, y: 20 })
  gsap.set('.hero__actions',     { opacity: 0, y: 20 })
  gsap.set('.hero__scroll-hint', { opacity: 0 })
  gsap.set('.hero__tagline',     { opacity: 0 })
  gsap.set('.hero__equalizer',   { opacity: 0 })
  gsap.set('.hero__st-phrase',   { opacity: 0, y: 40, scale: 0.96 })
  gsap.set('.hero__st-img',      { opacity: 0, scale: 1.05 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl
    // Título: line reveal épico (yPercent 110 → 0)
    .to('.hero__title .line-inner', {
      yPercent: 0,
      duration: 1.4,
      stagger: 0.18,
      ease: 'power4.out',
    })
    .to('.hero__eyebrow',    { opacity: 1, y: 0, duration: 0.9 }, '-=0.9')
    .to('.hero__sub',        { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero__actions',    { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.hero__scroll-hint',{ opacity: 1,        duration: 0.6 }, '-=0.3')
    .to('.hero__tagline',    { opacity: 1,        duration: 0.6 }, '-=0.5')
    .to('.hero__equalizer',  { opacity: 1,        duration: 1.2 }, '-=0.8')
    // Inicializar o scrollytelling após a animação de entrada
    .call(initHeroScrolltell)
}

/* ============================================================
   5. HERO — SCROLLYTELLING (pin + frases no scroll)
============================================================ */
function initHeroScrolltell() {
  const phrases   = document.querySelectorAll('.hero__st-phrase')
  const images    = document.querySelectorAll('.hero__st-img')
  const overlayEl = document.querySelector('.hero__st-images-overlay')
  const contentEl = document.getElementById('heroContent')

  if (!phrases.length) return

  const ytWrap = document.querySelector('.hero__yt-wrap')

  // Criar uma timeline GSAP vazia com scrub para ter controle suave
  // O conteúdo é manipulado via onUpdate com base no progress
  const scrollTl = gsap.timeline({ paused: true })
  // placeholder para dar duração à timeline (necessário pro scrub funcionar)
  scrollTl.to({}, { duration: 1 })

  ScrollTrigger.create({
    trigger: '#heroSpacer',
    start: 'top top',
    end: 'bottom bottom',
    animation: scrollTl,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress  // 0 → 1

      // Parallax suave no vídeo de fundo
      if (ytWrap) gsap.set(ytWrap, { y: p * 100 })

      // Fase 0 → 0.2: conteúdo principal sai (fade + slide up)
      if (p < 0.2) {
        const t = p / 0.2
        gsap.set(contentEl, { opacity: 1 - t, y: t * -60 })
      } else {
        gsap.set(contentEl, { opacity: 0 })
      }

      // 5 frases distribuídas pelo scroll — última permanece visível até o fim
      const phraseTiming = [
        { start: 0.10, peak: 0.16, end: 0.26, exitDur: 0.06 },
        { start: 0.28, peak: 0.34, end: 0.44, exitDur: 0.06 },
        { start: 0.46, peak: 0.52, end: 0.62, exitDur: 0.06 },
        { start: 0.64, peak: 0.70, end: 0.80, exitDur: 0.06 },
        { start: 0.82, peak: 0.88, end: 1.20, exitDur: 0.06 }, // end > 1: nunca sai
      ]

      let maxImgOpacity = 0

      phrases.forEach((phrase, i) => {
        const { start, peak, end, exitDur } = phraseTiming[i]

        let opacity = 0
        let y       = 40
        let scale   = 0.96

        // Fade da imagem começa um pouco antes da frase
        const imgStart = Math.max(0, start - 0.04)
        let imgOpacity = 0
        let imgScale   = 1.05

        if (p >= start && p < peak) {
          // Entrada
          const t = (p - start) / (peak - start)
          opacity = t
          y       = 40 * (1 - t)
          scale   = 0.96 + 0.04 * t
        } else if (p >= peak && p < end) {
          // Visível
          opacity = 1
          y       = 0
          scale   = 1
        } else if (p >= end && p < end + exitDur) {
          // Saída
          const t = (p - end) / exitDur
          opacity = 1 - t
          y       = -30 * t
          scale   = 1 - 0.04 * t
        }

        // Imagem: fade in durante entrada, visível durante peak/end, fade out na saída
        if (p >= imgStart && p < peak) {
          const t = (p - imgStart) / (peak - imgStart)
          imgOpacity = t
          imgScale   = 1.05 - 0.05 * t
        } else if (p >= peak && p < end) {
          imgOpacity = 1
          imgScale   = 1 - 0.02 * ((p - peak) / (end - peak))
        } else if (p >= end && p < end + exitDur) {
          const t = (p - end) / exitDur
          imgOpacity = 1 - t
          imgScale   = 0.98 - 0.03 * t
        }

        gsap.set(phrase, { opacity, y, scale })
        if (images[i]) gsap.set(images[i], { opacity: imgOpacity, scale: imgScale })
        if (imgOpacity > maxImgOpacity) maxImgOpacity = imgOpacity
      })

      // Overlay escuro só aparece quando uma imagem está visível
      if (overlayEl) gsap.set(overlayEl, { opacity: maxImgOpacity })
    },
  })
}

/* ============================================================
   5. NAV — SCROLL SUAVE + GLASSMORPHISM + LINK ATIVO
============================================================ */
const nav = document.getElementById('nav')
const navLinks = document.querySelectorAll('.nav__link')

// ── Glassmorphism ao scroll ──────────────────────────────────
ScrollTrigger.create({
  start: 'top -80px',
  onUpdate: (self) => {
    nav.classList.toggle('scrolled', self.progress > 0)
  },
})

// ── Scroll suave via Lenis ao clicar nos links ───────────────
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const target = link.getAttribute('href')   // ex: "#manifesto"
    const el = document.querySelector(target)
    if (!el) return

    lenis.scrollTo(el, {
      offset: -80,        // compensa a altura da nav fixa
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  })
})

// ── Botão Contato (CTA) — mesmo tratamento ───────────────────
document.querySelector('.nav__cta')?.addEventListener('click', (e) => {
  e.preventDefault()
  const el = document.getElementById('contato')
  if (el) lenis.scrollTo(el, { offset: 0, duration: 1.6 })
})

// ── Link ativo: destaca o link da seção visível ──────────────
const sectionIds = ['manifesto', 'ecossistema', 'portfolio', 'simulador', 'nexus']

sectionIds.forEach((id) => {
  const section = document.getElementById(id)
  if (!section) return

  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 55%',
    onEnter:      () => setActiveLink(id),
    onEnterBack:  () => setActiveLink(id),
    onLeave:      () => clearActiveLink(id),
    onLeaveBack:  () => clearActiveLink(id),
  })
})

function setActiveLink(id) {
  navLinks.forEach((l) => {
    const matches = l.getAttribute('href') === `#${id}`
    l.classList.toggle('is-active', matches)
  })
}

function clearActiveLink(id) {
  navLinks.forEach((l) => {
    if (l.getAttribute('href') === `#${id}`) {
      l.classList.remove('is-active')
    }
  })
}

/* ============================================================
   6. MANIFESTO — ANIMAÇÕES ESPECÍFICAS
============================================================ */

// Quote principal: linha por linha com line reveal
const mqLines = document.querySelectorAll('.mq-line')
mqLines.forEach((line) => {
  const inner = document.createElement('span')
  inner.className = 'line-reveal-inner'
  inner.innerHTML = line.innerHTML
  line.innerHTML = ''
  line.appendChild(inner)
})

gsap.to('.mq-line .line-reveal-inner', {
  scrollTrigger: {
    trigger: '.manifesto__statement',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
  y: 0,
  duration: 1.2,
  stagger: 0.18,
  ease: 'power4.out',
})

// Sub do manifesto
gsap.from('.manifesto__sub', {
  scrollTrigger: {
    trigger: '.manifesto__statement',
    start: 'top 75%',
  },
  opacity: 0,
  y: 24,
  duration: 0.9,
  delay: 0.5,
  ease: 'power3.out',
})

// Divisória
gsap.from('.manifesto__divider-line', {
  scrollTrigger: {
    trigger: '.manifesto__divider',
    start: 'top 85%',
  },
  scaleX: 0,
  duration: 1.2,
  ease: 'power3.inOut',
  stagger: 0.1,
})

gsap.from('.manifesto__divider-logo', {
  scrollTrigger: {
    trigger: '.manifesto__divider',
    start: 'top 85%',
  },
  opacity: 0,
  scale: 0.8,
  duration: 0.8,
  delay: 0.4,
  ease: 'back.out(2)',
})

// Cards de citação — fromTo garante estado inicial sem conflito com reveal-up
gsap.fromTo('.manifesto__quote-item',
  { opacity: 0, y: 48 },
  {
    scrollTrigger: {
      trigger: '.manifesto__quotes-wrap',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: 1.0,
    stagger: 0.18,
    ease: 'power3.out',
  }
)

// Linha do autor anima como underline
gsap.from('.manifesto__author-line', {
  scrollTrigger: {
    trigger: '.manifesto__quotes',
    start: 'top 75%',
  },
  scaleX: 0,
  duration: 0.8,
  stagger: 0.15,
  delay: 0.4,
  ease: 'power2.out',
  transformOrigin: 'left',
})

/* ============================================================
   7. REVEAL DE TEXTOS — SPLITTYPE
   Todos os elementos com .reveal-text têm words animados
============================================================ */
const revealTexts = document.querySelectorAll('.reveal-text')

revealTexts.forEach((el) => {
  // Dividir por palavras para melhor performance
  const split = new SplitType(el, { types: 'words' })

  gsap.from(split.words, {
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.04,
    ease: 'power3.out',
  })
})

/* ============================================================
   7. REVEAL DE BLOCOS — .reveal-up
============================================================ */
const revealUps = document.querySelectorAll('.reveal-up')

revealUps.forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: (i % 3) * 0.1, // stagger suave por grupo
    ease: 'power3.out',
  })
})

/* ============================================================
   8. PORTFÓLIO — PARALLAX + REVEALS
============================================================ */

// Parallax nas imagens dos cases
document.querySelectorAll('.pf-case__img').forEach((img) => {
  gsap.fromTo(img,
    { y: '-8%' },
    {
      y: '8%',
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.pf-case'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  )
})

// Case 1 — reveal com clippath de baixo para cima
gsap.from('#case1', {
  scrollTrigger: {
    trigger: '#case1',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
  clipPath: 'inset(100% 0% 0% 0%)',
  duration: 1.2,
  ease: 'power4.inOut',
})

// Cases 2 e 3 — entram da direita e esquerda
gsap.from('#case2', {
  scrollTrigger: { trigger: '.pf-cases-row', start: 'top 88%' },
  clipPath: 'inset(0% 100% 0% 0%)',
  duration: 1.1,
  ease: 'power4.inOut',
})

gsap.from('#case3', {
  scrollTrigger: { trigger: '.pf-cases-row', start: 'top 88%' },
  clipPath: 'inset(0% 0% 0% 100%)',
  duration: 1.1,
  delay: 0.1,
  ease: 'power4.inOut',
})

// Stats — stagger nos itens
gsap.from('.stats__item', {
  scrollTrigger: {
    trigger: '.stats',
    start: 'top 85%',
  },
  opacity: 0,
  y: 30,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power3.out',
})

/* ============================================================
   9. CONTADORES ANIMADOS — SEÇÃO STATS
============================================================ */
const statsNumbers = document.querySelectorAll('.stats__number')

statsNumbers.forEach((el) => {
  const target = parseInt(el.dataset.target, 10)

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val)
        },
      })
    },
  })
})

/* ============================================================
   10. ECOSSISTEMA — ANIMAÇÕES
============================================================ */

// Cards entram um por um com stagger em diagonal
const ecoCards = document.querySelectorAll('.eco__card')
ecoCards.forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: '.eco__grid',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    delay: i * 0.08,
    ease: 'power3.out',
  })
})

// Statement final: line reveal
const ecoLines = document.querySelectorAll('.eco__st-line')
ecoLines.forEach((line) => {
  const inner = document.createElement('span')
  inner.className = 'line-reveal-inner'
  inner.innerHTML = line.innerHTML
  line.innerHTML = ''
  line.appendChild(inner)
})

gsap.to('.eco__st-line .line-reveal-inner', {
  scrollTrigger: {
    trigger: '.eco__statement',
    start: 'top 85%',
  },
  y: 0,
  duration: 1.1,
  stagger: 0.15,
  ease: 'power4.out',
})

gsap.from('.eco__statement-sub', {
  scrollTrigger: { trigger: '.eco__statement', start: 'top 80%' },
  opacity: 0,
  y: 20,
  duration: 0.8,
  delay: 0.4,
  ease: 'power3.out',
})

// Tilt 3D nos eco cards (substituindo os antigos)
document.querySelectorAll('.eco__card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect()
    const rotX  = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -8
    const rotY  = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  *  8
    gsap.to(card, { rotationX: rotX, rotationY: rotY, transformPerspective: 900, duration: 0.35, ease: 'power2.out' })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' })
  })
})

/* ============================================================
   11. TRANSFORMAÇÃO — ENTRADA DAS COLUNAS
============================================================ */

// Título: line reveal
const tfTitleLines = document.querySelectorAll('.tf__title-line')
tfTitleLines.forEach((line) => {
  const wrap = document.createElement('span')
  wrap.style.cssText = 'display:block; overflow:hidden;'
  const inner = document.createElement('span')
  inner.className = 'line-reveal-inner'
  inner.innerHTML = line.innerHTML
  wrap.appendChild(inner)
  line.innerHTML = ''
  line.appendChild(wrap)
})

gsap.to('.tf__title-line .line-reveal-inner', {
  scrollTrigger: { trigger: '.tf__header', start: 'top 85%' },
  y: 0,
  duration: 1,
  stagger: 0.12,
  ease: 'power4.out',
})

// Colunas entram da esquerda/direita
gsap.from('.tf__col--sem', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 82%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  x: -60,
  duration: 1.1,
  ease: 'power3.out',
})

gsap.from('.tf__col--com', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 82%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  x: 60,
  duration: 1.1,
  ease: 'power3.out',
})

// Centro: badge escala do zero
gsap.from('.tf__center-badge', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 82%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  scale: 0,
  duration: 0.6,
  delay: 0.5,
  ease: 'back.out(2)',
})

// Linhas verticais do centro: crescem
gsap.from('.tf__center-line', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 82%',
    toggleActions: 'play none none none',
  },
  scaleY: 0,
  transformOrigin: 'center center',
  duration: 1,
  delay: 0.3,
  ease: 'power3.out',
})

// Itens das colunas: stagger vertical
gsap.from('.tf__col--sem .tf__item', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 78%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  x: -20,
  duration: 0.6,
  stagger: 0.07,
  delay: 0.2,
  ease: 'power2.out',
})

gsap.from('.tf__col--com .tf__item', {
  scrollTrigger: {
    trigger: '.tf__split',
    start: 'top 78%',
    toggleActions: 'play none none none',
  },
  opacity: 0,
  x: 20,
  duration: 0.6,
  stagger: 0.07,
  delay: 0.2,
  ease: 'power2.out',
})

/* ============================================================
   12. SIMULADOR — INTERAÇÃO PREMIUM
============================================================ */
const simOpts    = document.querySelectorAll('.sim__opt')
const simResults = document.querySelectorAll('.sim__result')
const simPlaceholder = document.getElementById('simPlaceholder')
const simCta     = document.getElementById('simCta')

// Entrada dos botões em stagger
gsap.from('.sim__opt', {
  scrollTrigger: { trigger: '.sim__options', start: 'top 88%' },
  opacity: 0,
  x: -30,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power3.out',
})

gsap.from('.sim__result-wrap, .sim__placeholder', {
  scrollTrigger: { trigger: '.sim__right', start: 'top 88%' },
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: 'power3.out',
})

simOpts.forEach((opt) => {
  opt.addEventListener('click', () => {
    const tipo = opt.dataset.tipo

    // Atualizar estado ativo
    simOpts.forEach((o) => o.classList.remove('active'))
    opt.classList.add('active')

    // Esconder placeholder
    if (simPlaceholder) {
      gsap.to(simPlaceholder, { opacity: 0, duration: 0.2, onComplete: () => {
        simPlaceholder.style.display = 'none'
      }})
    }

    // Esconder todos os resultados
    simResults.forEach((r) => {
      r.classList.remove('is-active')
    })

    // Mostrar resultado correto com animação
    const target = document.getElementById(`sim-${tipo}`)
    if (target) {
      target.classList.add('is-active')
      gsap.from(target, {
        opacity: 0,
        y: 24,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }

    // Mostrar CTA
    simCta.classList.add('visible')
  })
})

/* ============================================================
   13. NEXUS CLUB — ANIMAÇÕES
============================================================ */

// Título Nexus: line reveal
const nexusTitleLines = document.querySelectorAll('.nexus__title-line')
nexusTitleLines.forEach((line) => {
  const inner = document.createElement('span')
  inner.className = 'line-reveal-inner'
  inner.innerHTML = line.innerHTML
  line.innerHTML = ''
  line.appendChild(inner)
})

gsap.to('.nexus__title-line .line-reveal-inner', {
  scrollTrigger: { trigger: '.nexus__title', start: 'top 88%' },
  y: 0,
  duration: 1.1,
  stagger: 0.1,
  ease: 'power4.out',
})

// Pilares: stagger com clippath da esquerda
document.querySelectorAll('.nexus__pillar').forEach((pillar, i) => {
  gsap.from(pillar, {
    scrollTrigger: {
      trigger: '.nexus__pillars',
      start: 'top 85%',
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    delay: i * 0.12,
    ease: 'power3.out',
  })
})

/* ============================================================
   14. CTA FINAL — LINE REVEAL EM CASCATA
============================================================ */

// Animar cada linha
gsap.to('.cta-final__line-inner', {
  scrollTrigger: {
    trigger: '.cta-final',
    start: 'top 75%',
    toggleActions: 'play none none none',
  },
  y: 0,
  duration: 1.1,
  stagger: 0.18,
  ease: 'power4.out',
})

// Sub + CTA
gsap.from('.cta-final__sub', {
  scrollTrigger: { trigger: '.cta-final__bottom', start: 'top 88%' },
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: 'power3.out',
})

gsap.from('.cta-final__cta', {
  scrollTrigger: { trigger: '.cta-final__bottom', start: 'top 88%' },
  opacity: 0,
  y: 20,
  duration: 0.8,
  delay: 0.2,
  ease: 'power3.out',
})

/* ============================================================
   15. FOOTER — ANIMAÇÕES
============================================================ */
gsap.from('.footer__logo-img', {
  scrollTrigger: { trigger: '.footer', start: 'top 90%' },
  opacity: 0,
  x: -20,
  duration: 0.8,
  ease: 'power3.out',
})

gsap.from('.footer__tagline', {
  scrollTrigger: { trigger: '.footer', start: 'top 90%' },
  opacity: 0,
  x: 20,
  duration: 0.8,
  ease: 'power3.out',
})

gsap.from('.footer__col', {
  scrollTrigger: { trigger: '.footer__grid', start: 'top 92%' },
  opacity: 0,
  y: 20,
  duration: 0.7,
  stagger: 0.1,
  ease: 'power3.out',
})

/* ============================================================
   15. NAVEGAÇÃO SUAVE ENTRE ÂNCORAS (via Lenis)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector(anchor.getAttribute('href'))
    if (target) {
      lenis.scrollTo(target, { offset: -80, duration: 1.6 })
    }
  })
})

/* ============================================================
   16. EQUALIZADOR — ANIMAÇÃO ORGÂNICA DAS BARRAS
============================================================ */
const eqBars = document.querySelectorAll('.hero__eq-svg rect')

eqBars.forEach((bar, i) => {
  const minH = 4 + Math.random() * 10
  const maxH = 30 + Math.random() * 45
  const dur  = 0.5 + Math.random() * 1.2
  const delay = Math.random() * 1.5

  gsap.to(bar, {
    attr: { height: maxH, y: 80 - maxH },
    duration: dur,
    delay,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
})

/* ============================================================
   TRANSFORMAÇÃO — Globo de pontos/linhas (canvas 2D)
============================================================ */
;(function initTfGlobe() {
  const canvas = document.getElementById('tfGlobeCanvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  let W = 0, H = 0, R = 0
  const points = []

  // ── Polígonos de continentes [lng, lat] ──
  // Contornos simplificados mas geograficamente consistentes
  const CONTINENTS = [
    // Alasca
    [[-168,66],[-162,70],[-156,71],[-144,69],[-141,60],[-155,58],[-168,61],[-168,66]],
    // Canadá + EUA
    [[-141,69],[-128,70],[-110,70],[-95,72],[-82,73],[-68,82],[-60,62],[-55,52],[-60,47],[-70,44],[-75,40],[-77,37],[-76,35],[-81,31],[-80,25],[-83,28],[-88,30],[-94,29],[-97,26],[-98,19],[-106,22],[-117,32],[-122,37],[-124,42],[-125,48],[-132,55],[-141,60],[-141,69]],
    // México → Panamá
    [[-98,19],[-94,17],[-88,16],[-83,14],[-79,8],[-83,10],[-89,14],[-92,16],[-98,19]],
    // Groenlândia
    [[-55,60],[-40,60],[-22,66],[-15,76],[-30,83],[-55,82],[-60,70],[-55,60]],
    // Islândia
    [[-24,63],[-13,63],[-13,67],[-24,66],[-24,63]],
    // América do Sul
    [[-80,12],[-72,12],[-60,11],[-52,5],[-45,-1],[-35,-5],[-38,-15],[-45,-23],[-52,-30],[-60,-38],[-68,-50],[-72,-54],[-75,-52],[-74,-45],[-72,-30],[-72,-18],[-78,-5],[-81,-4],[-81,2],[-78,8],[-80,12]],
    // Reino Unido + Irlanda
    [[-10,51],[-5,50],[-2,51],[2,53],[1,58],[-4,59],[-8,57],[-10,54],[-10,51]],
    // Europa continental
    [[-10,44],[-5,43],[0,44],[5,43],[10,45],[15,46],[18,44],[22,40],[25,38],[28,37],[32,37],[36,36],[42,37],[48,44],[55,48],[58,52],[55,58],[45,62],[35,62],[25,62],[15,62],[5,60],[0,57],[-5,55],[-10,51],[-10,44]],
    // Escandinávia
    [[5,58],[15,56],[22,58],[28,63],[32,70],[27,71],[20,70],[12,67],[8,64],[5,62],[5,58]],
    // Rússia (norte)
    [[30,65],[45,65],[60,68],[80,70],[100,73],[130,73],[155,68],[175,66],[180,70],[180,77],[160,78],[130,78],[100,78],[75,78],[55,75],[45,72],[35,70],[30,65]],
    // Ásia Central + Mongólia + China + Coréia
    [[45,48],[55,50],[70,50],[85,50],[100,53],[115,53],[130,53],[135,48],[130,42],[128,38],[122,30],[118,24],[110,22],[105,20],[100,22],[95,28],[90,28],[85,32],[80,32],[75,35],[70,40],[60,45],[50,48],[45,48]],
    // SE Ásia (Indochina)
    [[95,20],[100,20],[103,18],[107,22],[110,22],[108,15],[106,10],[102,5],[100,2],[100,8],[96,12],[94,16],[95,20]],
    // Índia
    [[68,23],[72,19],[76,8],[80,7],[82,9],[86,18],[89,22],[91,25],[80,30],[75,32],[70,27],[68,23]],
    // Ásia Menor (Turquia)
    [[26,40],[33,37],[40,37],[46,39],[50,36],[48,32],[40,32],[35,35],[28,38],[26,40]],
    // Oriente Médio (Irã, Iraque)
    [[40,28],[48,25],[55,25],[60,27],[62,30],[58,35],[52,38],[46,38],[42,32],[40,28]],
    // Península Arábica
    [[35,28],[42,27],[48,25],[55,24],[58,18],[55,14],[50,13],[45,12],[42,15],[38,18],[35,22],[35,28]],
    // Indonésia (arquipélago)
    [[95,5],[100,5],[105,2],[112,-1],[118,-4],[125,-3],[132,-3],[138,-2],[141,-6],[140,-9],[130,-9],[120,-9],[110,-9],[102,-3],[95,0],[95,5]],
    // Nova Guiné
    [[130,-1],[141,-2],[150,-5],[152,-10],[140,-11],[130,-8],[130,-1]],
    // Filipinas
    [[118,6],[122,7],[125,14],[121,18],[118,13],[117,9],[118,6]],
    // Austrália
    [[113,-12],[125,-12],[136,-12],[142,-11],[146,-17],[150,-23],[153,-28],[151,-33],[146,-38],[140,-38],[131,-34],[119,-34],[114,-23],[113,-15],[113,-12]],
    // Tasmânia
    [[144,-40],[148,-40],[148,-43],[145,-44],[144,-40]],
    // Japão
    [[130,32],[134,34],[140,37],[144,43],[145,45],[141,45],[137,41],[133,35],[130,32]],
    // Nova Zelândia — ilha norte
    [[172,-34],[178,-37],[178,-41],[173,-42],[170,-37],[172,-34]],
    // Nova Zelândia — ilha sul
    [[166,-41],[174,-41],[172,-47],[166,-46],[166,-41]],
    // Madagascar
    [[43,-13],[50,-15],[50,-25],[44,-25],[43,-13]],
    // África
    [[-17,35],[-8,34],[0,36],[10,37],[18,32],[25,32],[32,32],[35,22],[37,17],[42,12],[46,11],[48,10],[51,11],[50,4],[42,0],[40,-5],[38,-10],[40,-18],[35,-22],[30,-27],[24,-33],[18,-34],[13,-28],[10,-20],[10,-8],[5,-2],[0,5],[-5,5],[-10,6],[-15,12],[-17,20],[-17,35]],
  ]

  // Ray casting: ponto dentro do polígono?
  function inPoly(lng, lat, poly) {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1]
      const xj = poly[j][0], yj = poly[j][1]
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  function isLand(lng, lat) {
    for (let i = 0; i < CONTINENTS.length; i++) {
      if (inPoly(lng, lat, CONTINENTS[i])) return true
    }
    return false
  }

  // ── Fibonacci sphere preenchendo TODA a esfera ──
  // Todos os pontos entram (terra e mar); terra fica mais brilhante.
  const NUM_SAMPLES = 1100
  function generatePoints() {
    points.length = 0
    const phi = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < NUM_SAMPLES; i++) {
      const y = 1 - (i / (NUM_SAMPLES - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = phi * i
      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r

      const lat = Math.asin(y) * 180 / Math.PI
      const lng = Math.atan2(z, x) * 180 / Math.PI

      points.push({ x, y, z, land: isLand(lng, lat) })
    }
  }

  // ── Conexões entre vizinhos próximos (pra dar malha triangulada) ──
  const CONN_DIST = 0.22
  const connections = []
  function buildConnections() {
    connections.length = 0
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x
        const dy = points[i].y - points[j].y
        const dz = points[i].z - points[j].z
        const d2 = dx*dx + dy*dy + dz*dz
        if (d2 < CONN_DIST * CONN_DIST) {
          connections.push([i, j])
        }
      }
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    W = rect.width
    H = rect.height
    R = Math.min(W, H) * 0.42
    canvas.width  = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  generatePoints()
  buildConnections()
  resize()
  window.addEventListener('resize', resize)

  // ── Conexões país-país: raios longos ligando continentes diferentes ──
  const COUNTRY_LINKS = []
  ;(function buildCountryLinks() {
    const landIdx = []
    for (let i = 0; i < points.length; i++) if (points[i].land) landIdx.push(i)
    if (landIdx.length < 10) return

    // RNG determinístico (mesmo padrão em todo carregamento)
    let seed = 1337
    const rand = () => {
      seed = (seed * 1103515245 + 12345) | 0
      return ((seed >>> 1) / 0x7FFFFFFF)
    }

    const MIN_D2 = 0.9 * 0.9     // distância mínima → evita repetir o mesh
    const MAX_D2 = 2.0 * 2.0     // evita cordas antipodais estranhas
    const TARGET = 14
    const seen = new Set()
    let attempts = 0
    while (COUNTRY_LINKS.length < TARGET && attempts < TARGET * 40) {
      attempts++
      const a = landIdx[(rand() * landIdx.length) | 0]
      const b = landIdx[(rand() * landIdx.length) | 0]
      if (a === b) continue
      const p = points[a], q = points[b]
      const dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z
      const d2 = dx*dx + dy*dy + dz*dz
      if (d2 < MIN_D2 || d2 > MAX_D2) continue
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (seen.has(key)) continue
      seen.add(key)
      COUNTRY_LINKS.push([a, b])
    }
  })()

  // ── Hubs globais (cidades) + rotas que ligam continentes ──
  const HUBS_LL = [
    [-74,   40],  //  0 Nova York
    [-99,   19],  //  1 Cidade do México
    [-46,  -23],  //  2 São Paulo
    [-58,  -34],  //  3 Buenos Aires
    [-118,  34],  //  4 Los Angeles
    [0,     51],  //  5 Londres
    [13,    52],  //  6 Berlim
    [37,    55],  //  7 Moscou
    [28,    41],  //  8 Istambul
    [31,    30],  //  9 Cairo
    [18,   -33],  // 10 Cidade do Cabo
    [55,    25],  // 11 Dubai
    [77,    28],  // 12 Delhi
    [103,    1],  // 13 Singapura
    [121,   31],  // 14 Xangai
    [139,   35],  // 15 Tóquio
    [151,  -33],  // 16 Sydney
  ]
  const LINKS = [
    [0, 2], [0, 5], [0, 4], [0, 1],
    [4, 15], [4, 16],
    [2, 3], [2, 10], [2, 5],
    [5, 6], [5, 9],
    [6, 7], [6, 8],
    [7, 14],
    [8, 9], [8, 11],
    [9, 10],
    [10, 11],
    [11, 12], [11, 13],
    [12, 14], [12, 13],
    [13, 14], [13, 16],
    [14, 15],
    [15, 16],
  ]

  function llToXYZ(lng, lat) {
    const lr = lat * Math.PI / 180
    const gr = lng * Math.PI / 180
    const cl = Math.cos(lr)
    return { x: cl * Math.cos(gr), y: Math.sin(lr), z: cl * Math.sin(gr) }
  }
  const hubPts = HUBS_LL.map(([g, l]) => llToXYZ(g, l))
  const hubProj = hubPts.map(() => ({ x: 0, y: 0, z: 0 }))

  // ── Cor dourada baseada na profundidade (z) ──
  // z = -1 (atrás) → escuro/translúcido · z = +1 (frente) → claro/brilhante
  function goldColor(z, alphaBase = 1) {
    // depth: 0 (atrás) → 1 (frente)
    const depth = (z + 1) * 0.5
    // interpola #be814a → #e4c079 → #f9e9b2
    let r, g, b
    if (depth < 0.5) {
      const t = depth * 2
      r = 190 + (228 - 190) * t
      g = 129 + (192 - 129) * t
      b = 74  + (121 -  74) * t
    } else {
      const t = (depth - 0.5) * 2
      r = 228 + (249 - 228) * t
      g = 192 + (233 - 192) * t
      b = 121 + (178 - 121) * t
    }
    // alpha: mais transparente atrás
    const a = alphaBase * (0.25 + depth * 0.75)
    return `rgba(${r|0}, ${g|0}, ${b|0}, ${a.toFixed(3)})`
  }

  let rotY = 0
  let rotX = -0.35  // leve inclinação (polo norte pra cima)

  // buffer de posições projetadas reutilizado a cada frame
  const proj = new Array(points.length)
  for (let i = 0; i < points.length; i++) proj[i] = { x: 0, y: 0, z: 0 }

  function render() {
    rotY += 0.0035
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
    const cx = W / 2, cy = H / 2

    // Projetar todos os pontos
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      // rotY em torno do eixo Y
      const x1 =  p.x * cosY + p.z * sinY
      const z1 = -p.x * sinY + p.z * cosY
      const y1 =  p.y
      // rotX em torno do eixo X
      const y2 = y1 * cosX - z1 * sinX
      const z2 = y1 * sinX + z1 * cosX
      const x2 = x1
      proj[i].x = cx + x2 * R
      proj[i].y = cy + y2 * R
      proj[i].z = z2
    }

    ctx.clearRect(0, 0, W, H)

    // ── Desenhar linhas (conexões) — terra clara e destacada, mar quase invisível ──
    for (let k = 0; k < connections.length; k++) {
      const [i, j] = connections[k]
      const a = proj[i], b = proj[j]
      const zAvg = (a.z + b.z) * 0.5
      if (zAvg < -0.3) continue
      const bothLand = points[i].land && points[j].land
      if (!bothLand) {
        // mar: ignora quase tudo, deixa só uma neblina sutil
        if ((i + j) % 3 !== 0) continue
        ctx.lineWidth = 0.4
        ctx.strokeStyle = goldColor(zAvg, 0.06)
      } else {
        ctx.lineWidth = 0.7
        ctx.strokeStyle = goldColor(zAvg, 0.65)
      }
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    // ── Desenhar rotas país-país (raios dourados ligando continentes) ──
    for (let l = 0; l < COUNTRY_LINKS.length; l++) {
      const a = proj[COUNTRY_LINKS[l][0]]
      const b = proj[COUNTRY_LINKS[l][1]]
      const zAvg = (a.z + b.z) * 0.5
      if (zAvg < -0.6) continue
      ctx.lineWidth = 0.7
      ctx.strokeStyle = goldColor(zAvg, 0.55)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    // ── Desenhar pontos ──
    for (let i = 0; i < points.length; i++) {
      const p = proj[i]
      const isLandPt = points[i].land
      const size = isLandPt ? (1.2 + (p.z + 1) * 1.3) : (0.5 + (p.z + 1) * 0.6)
      const alpha = isLandPt ? 1.0 : 0.15
      ctx.fillStyle = goldColor(p.z, alpha)
      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── Projetar hubs ──
    for (let h = 0; h < hubPts.length; h++) {
      const p = hubPts[h]
      const x1 =  p.x * cosY + p.z * sinY
      const z1 = -p.x * sinY + p.z * cosY
      const y1 =  p.y
      const y2 = y1 * cosX - z1 * sinX
      const z2 = y1 * sinX + z1 * cosX
      hubProj[h].x = cx + x1 * R
      hubProj[h].y = cy + y2 * R
      hubProj[h].z = z2
    }

    // ── Desenhar rotas como cordas retas (raios dourados atravessando o globo) ──
    for (let l = 0; l < LINKS.length; l++) {
      const a = hubProj[LINKS[l][0]]
      const b = hubProj[LINKS[l][1]]
      const zAvg = (a.z + b.z) * 0.5
      if (zAvg < -0.7) continue
      ctx.lineWidth = 1.0
      ctx.strokeStyle = goldColor(zAvg, 0.75)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    // ── Desenhar hubs (nós maiores com halo) ──
    for (let h = 0; h < hubProj.length; h++) {
      const p = hubProj[h]
      if (p.z < -0.4) continue
      const size = 1.8 + (p.z + 1) * 1.3
      ctx.fillStyle = goldColor(p.z, 0.25)
      ctx.beginPath()
      ctx.arc(p.x, p.y, size * 2.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = goldColor(p.z, 1.0)
      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    requestAnimationFrame(render)
  }

  render()
})()

/* ─────────────────────────────────────────────
   I18N — DICIONÁRIO DE TRADUÇÕES
───────────────────────────────────────────── */
const I18N = {
  pt: {
    'nav.manifesto': 'Manifesto',
    'nav.servicos': 'Serviços',
    'nav.cases': 'Cases',
    'nav.simulador': 'Simulador',
    'nav.nexus': 'Nexus Club',
    'nav.contato': 'Contato',

    'loader.label': 'Carregando experiência',
    'loader.tagline': 'Se é HIT, é Sucesso!',

    'hero.eyebrow': 'O poder da música é a estrela do nosso trabalho',
    'hero.title1': 'Música é o centro',
    'hero.title2': 'de tudo que fazemos.',
    'hero.sub': 'Música é conexão, memória e emoção.',
    'hero.btnExplorar': 'Explorar',
    'hero.btnFalar': 'Falar com a HIT',
    'hero.scroll': 'scroll',
    'hero.tagline': 'Se é HIT, é Sucesso!',
    'hero.st0': 'A música conta a história das pessoas.',
    'hero.st1': 'Música gera conexão.',
    'hero.st2': 'Conexão gera memória.',
    'hero.st3': 'Memória gera valor.',
    'hero.st4': 'Valor gera negócios.',

    'manifesto.label': 'Manifesto',
    'manifesto.lead': 'Há 18 anos conectamos marcas às pessoas através do que há de mais humano: a música. Não fazemos entretenimento — fazemos história.',
    'manifesto.quote1': '"Não criamos',
    'manifesto.quote2': 'campanhas.',
    'manifesto.quote3': 'Criamos conexões."',
    'manifesto.sub': 'Criar experiências que marcam a vida das pessoas.',
    'manifesto.q1': '"Quando usamos música de forma estratégica, transformamos mensagens comuns em experiências que conectam emocionalmente com o público."',
    'manifesto.q2': '"A música está presente em todos os momentos da nossa vida, do nascimento às despedidas, marcando histórias, criando identidades e despertando sentimentos únicos."',
    'manifesto.q3': '"Nós amamos música porque ela transforma, aproxima e potencializa mensagens como nenhum outro meio."',
    'manifesto.qAuthor': 'Fabio Lopes — Fundador, HIT Music Business',

    'eco.label': 'Ecossistema',
    'eco.title': 'O que fazemos',
    'eco.desc': 'Seis frentes estratégicas que transformam<br>música em resultado para a sua marca.',
    'eco.c1.title': 'Estratégia de Marca com Música',
    'eco.c1.desc': 'Conectamos marcas ao poder emocional da música para criar posicionamento único.',
    'eco.c2.title': 'Experiências & Ativações',
    'eco.c2.desc': 'Momentos que transcendem o comum e geram memória afetiva duradoura.',
    'eco.c3.title': 'Eventos & Shows',
    'eco.c3.desc': 'Produção de eventos que combinam entretenimento e estratégia de marca.',
    'eco.c4.title': 'Conexão com Artistas',
    'eco.c4.desc': 'Curadoria e matchmaking entre marcas e talentos musicais.',
    'eco.c5.title': 'Plataforma & Tecnologia',
    'eco.c5.desc': 'Infraestrutura digital para amplificar o alcance e medir resultados.',
    'eco.c6.title': 'Engajamento & Comunidade',
    'eco.c6.desc': 'Construímos bases de fãs que se tornam embaixadores da marca.',
    'eco.st1': 'Música não é um complemento.',
    'eco.st2': 'É o centro.',
    'eco.stSub': 'Ela conecta, ativa, influencia e permanece.',

    'pf.label': 'Experiência',
    'pf.title': 'Cases que<br>marcaram.',
    'pf.subtitle': 'Experiências que geram memória.<br>Memória que gera valor.',
    'pf.phrase': 'Criamos experiências que não apenas acontecem… <strong>Mas permanecem.</strong>',
    'pf.case1.title': 'Especial Amigos',
    'pf.case1.tag': 'TV Globo',
    'pf.case1.desc': 'O maior especial musical da televisão brasileira, reunindo os maiores nomes do sertanejo num único palco.',
    'pf.case2.title': 'Villa Mix Festival',
    'pf.case2.tag': 'Maior Palco do Mundo · Guinness Book',
    'pf.case3.title': 'Villa Mix',
    'pf.case3.tag': 'Goiânia',
    'anos18.tagline': 'Dezoito anos<br>construindo história<br>com música.',
    'anos18.stat1': 'Eventos realizados',
    'anos18.stat2': 'Pessoas impactadas',
    'anos18.stat3': 'Marcas parceiras',
    'anos18.stat4': 'Clientes satisfeitos',

    'faixa.text': 'Criar experiências que marcam a vida das pessoas.',

    'tf.label': 'Transformação',
    'tf.title1': 'O efeito',
    'tf.semTag': 'Sem a HIT',
    'tf.comTag': 'Com a HIT',
    'tf.sem1': 'Marca invisível no entretenimento',
    'tf.sem2': 'Eventos sem estratégia de marca',
    'tf.sem3': 'Público disperso e não fidelizado',
    'tf.sem4': 'Investimento sem mensuração',
    'tf.sem5': 'Campanhas genéricas e esquecíveis',
    'tf.com1': 'Marca protagonista na cultura',
    'tf.com2': 'Eventos como plataforma estratégica',
    'tf.com3': 'Comunidade engajada e monetizável',
    'tf.com4': 'ROI claro e mensurável',
    'tf.com5': 'Experiências que viram memória',

    'sim.label': 'Simulador',
    'sim.title': 'Qual é o <em>objetivo</em> da sua marca?',
    'sim.sub': 'Selecione e descubra como a HIT cria o resultado.',
    'sim.opt1': 'Branding',
    'sim.opt2': 'Engajamento',
    'sim.opt3': 'Eventos',
    'sim.opt4': 'Receita',
    'sim.placeholder': 'Selecione um objetivo ao lado',
    'sim.bra.tag': 'Branding',
    'sim.bra.title': 'Sua marca se torna <em>inconfundível</em>',
    'sim.bra.desc': 'Com música estratégica alinhada à identidade da marca, criamos uma assinatura sonora que se instala na memória do consumidor — tornando cada ponto de contato reconhecível e emocional.',
    'sim.bra.li1': 'Assinatura sonora exclusiva',
    'sim.bra.li2': 'Jingles e trilhas de campanha',
    'sim.bra.li3': 'Identidade musical completa',
    'sim.eng.tag': 'Engajamento',
    'sim.eng.title': 'Espectadores viram <em>fãs</em>',
    'sim.eng.desc': 'Criamos experiências musicais que transformam audiência passiva em comunidade ativa — pessoas que recomendam, compartilham e se tornam embaixadoras orgânicas da sua marca.',
    'sim.eng.li1': 'Ativações ao vivo e digitais',
    'sim.eng.li2': 'Conteúdo musical para redes sociais',
    'sim.eng.li3': 'Campanhas de user-generated content',
    'sim.eve.tag': 'Eventos',
    'sim.eve.title': 'Shows que viram <em>resultados</em>',
    'sim.eve.desc': 'Produzimos e curamos experiências ao vivo que conectam marcas ao público em momentos de alta emoção — do Villa Mix Festival a ativações corporativas de alto impacto.',
    'sim.eve.li1': 'Curadoria de artistas e line-up',
    'sim.eve.li2': 'Produção de eventos corporativos',
    'sim.eve.li3': 'Patrocínio e branding em festivais',
    'sim.rec.tag': 'Receita',
    'sim.rec.title': 'Entretenimento vira <em>ROI</em>',
    'sim.rec.desc': 'Convertemos músicos e artistas em ativos de marca — e transformamos eventos e experiências culturais em canais de receita mensurável com retorno comprovado.',
    'sim.rec.li1': 'Modelos de monetização de fãs',
    'sim.rec.li2': 'Nexus Club — receita recorrente',
    'sim.rec.li3': 'Licenciamento e direitos musicais',
    'sim.cta': 'Vamos conversar',

    'nexus.label': 'Produto Exclusivo',
    'nexus.title1': 'Nexus',
    'nexus.title2': 'Club.',
    'nexus.desc': 'Uma comunidade fechada que transforma público em base, base em relacionamento — e relacionamento em receita recorrente e sustentável.',
    'nexus.cta': 'Quero fazer parte',
    'nexus.p1.title': 'Comunidade',
    'nexus.p1.desc': 'Rede curada de marcas, talentos e decisores do mercado de música e entretenimento.',
    'nexus.p2.title': 'Gamificação',
    'nexus.p2.desc': 'Mecânicas de engajamento contínuo que mantêm o público ativo, recompensado e conectado.',
    'nexus.p3.title': 'Receita',
    'nexus.p3.desc': 'Modelos de monetização que convertem base de fãs em fluxo de receita previsível e recorrente.',
    'nexus.p4.title': 'Experiências',
    'nexus.p4.desc': 'Acesso privilegiado a eventos, bastidores e momentos que apenas membros do Nexus vivem.',

    'cta.l1': 'Se é HIT, é sentido.',
    'cta.l2': 'Se é sentido, vira memória.',
    'cta.l3': 'E memória vira valor.',
    'cta.l4': 'Se é HIT, é sucesso.',
    'cta.sub': 'Transforme sua marca em algo<br>que as pessoas sintam.',
    'cta.btn': 'Falar com a HIT',

    'footer.tagline': 'Se é HIT,<br><em>é sucesso.</em>',
    'footer.address': 'Rua Luigi Galvani, 70 – 12º andar<br>Itaim Bibi – São Paulo – SP<br>04575-020',
    'footer.redes': 'Redes',
    'footer.contatoTitle': 'Contato',
    'footer.nav': 'Navegação',
    'footer.ecossistema': 'Ecossistema',
    'footer.portfolio': 'Portfólio',
    'footer.copyright': '© 2026 HIT Music Business. Todos os direitos reservados.',
    'footer.bottomRight': 'Music Business · São Paulo · Brasil'
  },

  en: {
    'nav.manifesto': 'Manifesto',
    'nav.servicos': 'Services',
    'nav.cases': 'Cases',
    'nav.simulador': 'Simulator',
    'nav.nexus': 'Nexus Club',
    'nav.contato': 'Contact',

    'loader.label': 'Loading experience',
    'loader.tagline': 'If it\'s HIT, it\'s Success!',

    'hero.eyebrow': 'The power of music is the star of our work',
    'hero.title1': 'Music is at the center',
    'hero.title2': 'of everything we do.',
    'hero.sub': 'Music is connection, memory and emotion.',
    'hero.btnExplorar': 'Explore',
    'hero.btnFalar': 'Talk to HIT',
    'hero.scroll': 'scroll',
    'hero.tagline': 'If it\'s HIT, it\'s Success!',
    'hero.st0': 'Music tells the story of people.',
    'hero.st1': 'Music creates connection.',
    'hero.st2': 'Connection creates memory.',
    'hero.st3': 'Memory creates value.',
    'hero.st4': 'Value creates business.',

    'manifesto.label': 'Manifesto',
    'manifesto.lead': 'For 18 years we have connected brands with people through the most human thing there is: music. We don\'t do entertainment — we make history.',
    'manifesto.quote1': '"We don\'t create',
    'manifesto.quote2': 'campaigns.',
    'manifesto.quote3': 'We create connections."',
    'manifesto.sub': 'Creating experiences that mark people\'s lives.',
    'manifesto.q1': '"When we use music strategically, we turn ordinary messages into experiences that connect emotionally with the audience."',
    'manifesto.q2': '"Music is present in every moment of our lives, from birth to farewells, marking stories, creating identities and awakening unique feelings."',
    'manifesto.q3': '"We love music because it transforms, brings together and amplifies messages like no other medium."',
    'manifesto.qAuthor': 'Fabio Lopes — Founder, HIT Music Business',

    'eco.label': 'Ecosystem',
    'eco.title': 'What we do',
    'eco.desc': 'Six strategic fronts that turn<br>music into results for your brand.',
    'eco.c1.title': 'Brand Strategy with Music',
    'eco.c1.desc': 'We connect brands to the emotional power of music to create unique positioning.',
    'eco.c2.title': 'Experiences & Activations',
    'eco.c2.desc': 'Moments that transcend the ordinary and create lasting emotional memory.',
    'eco.c3.title': 'Events & Shows',
    'eco.c3.desc': 'Event production that combines entertainment with brand strategy.',
    'eco.c4.title': 'Artist Connection',
    'eco.c4.desc': 'Curation and matchmaking between brands and musical talents.',
    'eco.c5.title': 'Platform & Technology',
    'eco.c5.desc': 'Digital infrastructure to amplify reach and measure results.',
    'eco.c6.title': 'Engagement & Community',
    'eco.c6.desc': 'We build fan bases that become brand ambassadors.',
    'eco.st1': 'Music is not an add-on.',
    'eco.st2': 'It\'s the center.',
    'eco.stSub': 'It connects, activates, influences and endures.',

    'pf.label': 'Experience',
    'pf.title': 'Cases that<br>made a mark.',
    'pf.subtitle': 'Experiences that create memory.<br>Memory that creates value.',
    'pf.phrase': 'We create experiences that don\'t just happen… <strong>They endure.</strong>',
    'pf.case1.title': 'Especial Amigos',
    'pf.case1.tag': 'TV Globo',
    'pf.case1.desc': 'The biggest musical special on Brazilian television, bringing together the greatest sertanejo names on a single stage.',
    'pf.case2.title': 'Villa Mix Festival',
    'pf.case2.tag': 'World\'s Largest Stage · Guinness Book',
    'pf.case3.title': 'Villa Mix',
    'pf.case3.tag': 'Goiânia',
    'anos18.tagline': 'Eighteen years<br>building history<br>with music.',
    'anos18.stat1': 'Events delivered',
    'anos18.stat2': 'People reached',
    'anos18.stat3': 'Partner brands',
    'anos18.stat4': 'Satisfied clients',

    'faixa.text': 'Creating experiences that mark people\'s lives.',

    'tf.label': 'Transformation',
    'tf.title1': 'The effect',
    'tf.semTag': 'Without HIT',
    'tf.comTag': 'With HIT',
    'tf.sem1': 'Brand invisible in entertainment',
    'tf.sem2': 'Events without brand strategy',
    'tf.sem3': 'Scattered, non-loyal audience',
    'tf.sem4': 'Investment without measurement',
    'tf.sem5': 'Generic, forgettable campaigns',
    'tf.com1': 'Brand as cultural protagonist',
    'tf.com2': 'Events as a strategic platform',
    'tf.com3': 'Engaged, monetizable community',
    'tf.com4': 'Clear, measurable ROI',
    'tf.com5': 'Experiences that become memory',

    'sim.label': 'Simulator',
    'sim.title': 'What is your brand\'s <em>goal</em>?',
    'sim.sub': 'Select and discover how HIT creates the result.',
    'sim.opt1': 'Branding',
    'sim.opt2': 'Engagement',
    'sim.opt3': 'Events',
    'sim.opt4': 'Revenue',
    'sim.placeholder': 'Select a goal on the left',
    'sim.bra.tag': 'Branding',
    'sim.bra.title': 'Your brand becomes <em>unmistakable</em>',
    'sim.bra.desc': 'With strategic music aligned to brand identity, we create a sonic signature that takes hold in consumer memory — making every touchpoint recognizable and emotional.',
    'sim.bra.li1': 'Exclusive sonic signature',
    'sim.bra.li2': 'Jingles and campaign tracks',
    'sim.bra.li3': 'Complete musical identity',
    'sim.eng.tag': 'Engagement',
    'sim.eng.title': 'Viewers become <em>fans</em>',
    'sim.eng.desc': 'We craft musical experiences that turn passive audiences into active communities — people who recommend, share and become organic brand ambassadors.',
    'sim.eng.li1': 'Live and digital activations',
    'sim.eng.li2': 'Musical content for social media',
    'sim.eng.li3': 'User-generated content campaigns',
    'sim.eve.tag': 'Events',
    'sim.eve.title': 'Shows that become <em>results</em>',
    'sim.eve.desc': 'We produce and curate live experiences that connect brands to audiences in moments of high emotion — from Villa Mix Festival to high-impact corporate activations.',
    'sim.eve.li1': 'Artist curation and line-up',
    'sim.eve.li2': 'Corporate event production',
    'sim.eve.li3': 'Festival sponsorship and branding',
    'sim.rec.tag': 'Revenue',
    'sim.rec.title': 'Entertainment becomes <em>ROI</em>',
    'sim.rec.desc': 'We turn musicians and artists into brand assets — and transform events and cultural experiences into measurable revenue channels with proven returns.',
    'sim.rec.li1': 'Fan monetization models',
    'sim.rec.li2': 'Nexus Club — recurring revenue',
    'sim.rec.li3': 'Music licensing and rights',
    'sim.cta': 'Let\'s talk',

    'nexus.label': 'Exclusive Product',
    'nexus.title1': 'Nexus',
    'nexus.title2': 'Club.',
    'nexus.desc': 'A closed community that turns audience into base, base into relationship — and relationship into recurring, sustainable revenue.',
    'nexus.cta': 'I want to join',
    'nexus.p1.title': 'Community',
    'nexus.p1.desc': 'Curated network of brands, talents and decision makers in the music and entertainment industry.',
    'nexus.p2.title': 'Gamification',
    'nexus.p2.desc': 'Continuous engagement mechanics that keep the audience active, rewarded and connected.',
    'nexus.p3.title': 'Revenue',
    'nexus.p3.desc': 'Monetization models that convert fan bases into predictable, recurring revenue streams.',
    'nexus.p4.title': 'Experiences',
    'nexus.p4.desc': 'Privileged access to events, behind-the-scenes moments and experiences only Nexus members live.',

    'cta.l1': 'If it\'s HIT, it\'s feeling.',
    'cta.l2': 'If it\'s feeling, it becomes memory.',
    'cta.l3': 'And memory becomes value.',
    'cta.l4': 'If it\'s HIT, it\'s success.',
    'cta.sub': 'Turn your brand into something<br>people can feel.',
    'cta.btn': 'Talk to HIT',

    'footer.tagline': 'If it\'s HIT,<br><em>it\'s success.</em>',
    'footer.address': 'Rua Luigi Galvani, 70 – 12th floor<br>Itaim Bibi – São Paulo – SP<br>04575-020 – Brazil',
    'footer.redes': 'Social',
    'footer.contatoTitle': 'Contact',
    'footer.nav': 'Navigation',
    'footer.ecossistema': 'Ecosystem',
    'footer.portfolio': 'Portfolio',
    'footer.copyright': '© 2026 HIT Music Business. All rights reserved.',
    'footer.bottomRight': 'Music Business · São Paulo · Brazil'
  },

  es: {
    'nav.manifesto': 'Manifiesto',
    'nav.servicos': 'Servicios',
    'nav.cases': 'Casos',
    'nav.simulador': 'Simulador',
    'nav.nexus': 'Nexus Club',
    'nav.contato': 'Contacto',

    'loader.label': 'Cargando experiencia',
    'loader.tagline': '¡Si es HIT, es Éxito!',

    'hero.eyebrow': 'El poder de la música es la estrella de nuestro trabajo',
    'hero.title1': 'La música es el centro',
    'hero.title2': 'de todo lo que hacemos.',
    'hero.sub': 'La música es conexión, memoria y emoción.',
    'hero.btnExplorar': 'Explorar',
    'hero.btnFalar': 'Hablar con HIT',
    'hero.scroll': 'scroll',
    'hero.tagline': '¡Si es HIT, es Éxito!',
    'hero.st0': 'La música cuenta la historia de las personas.',
    'hero.st1': 'La música genera conexión.',
    'hero.st2': 'La conexión genera memoria.',
    'hero.st3': 'La memoria genera valor.',
    'hero.st4': 'El valor genera negocios.',

    'manifesto.label': 'Manifiesto',
    'manifesto.lead': 'Hace 18 años conectamos marcas con personas a través de lo más humano que existe: la música. No hacemos entretenimiento — hacemos historia.',
    'manifesto.quote1': '"No creamos',
    'manifesto.quote2': 'campañas.',
    'manifesto.quote3': 'Creamos conexiones."',
    'manifesto.sub': 'Crear experiencias que marcan la vida de las personas.',
    'manifesto.q1': '"Cuando usamos la música de forma estratégica, transformamos mensajes comunes en experiencias que conectan emocionalmente con el público."',
    'manifesto.q2': '"La música está presente en todos los momentos de nuestra vida, del nacimiento a las despedidas, marcando historias, creando identidades y despertando sentimientos únicos."',
    'manifesto.q3': '"Amamos la música porque transforma, acerca y potencia los mensajes como ningún otro medio."',
    'manifesto.qAuthor': 'Fabio Lopes — Fundador, HIT Music Business',

    'eco.label': 'Ecosistema',
    'eco.title': 'Lo que hacemos',
    'eco.desc': 'Seis frentes estratégicos que transforman<br>la música en resultado para tu marca.',
    'eco.c1.title': 'Estrategia de Marca con Música',
    'eco.c1.desc': 'Conectamos marcas con el poder emocional de la música para crear un posicionamiento único.',
    'eco.c2.title': 'Experiencias y Activaciones',
    'eco.c2.desc': 'Momentos que trascienden lo común y generan memoria afectiva duradera.',
    'eco.c3.title': 'Eventos y Shows',
    'eco.c3.desc': 'Producción de eventos que combinan entretenimiento y estrategia de marca.',
    'eco.c4.title': 'Conexión con Artistas',
    'eco.c4.desc': 'Curaduría y matchmaking entre marcas y talentos musicales.',
    'eco.c5.title': 'Plataforma y Tecnología',
    'eco.c5.desc': 'Infraestructura digital para amplificar el alcance y medir resultados.',
    'eco.c6.title': 'Engagement y Comunidad',
    'eco.c6.desc': 'Construimos bases de fans que se vuelven embajadores de la marca.',
    'eco.st1': 'La música no es un complemento.',
    'eco.st2': 'Es el centro.',
    'eco.stSub': 'Conecta, activa, influye y permanece.',

    'pf.label': 'Experiencia',
    'pf.title': 'Casos que<br>marcaron.',
    'pf.subtitle': 'Experiencias que generan memoria.<br>Memoria que genera valor.',
    'pf.phrase': 'Creamos experiencias que no solo suceden… <strong>Permanecen.</strong>',
    'pf.case1.title': 'Especial Amigos',
    'pf.case1.tag': 'TV Globo',
    'pf.case1.desc': 'El mayor especial musical de la televisión brasileña, reuniendo a los mayores nombres del sertanejo en un solo escenario.',
    'pf.case2.title': 'Villa Mix Festival',
    'pf.case2.tag': 'El Mayor Escenario del Mundo · Guinness Book',
    'pf.case3.title': 'Villa Mix',
    'pf.case3.tag': 'Goiânia',
    'anos18.tagline': 'Dieciocho años<br>construyendo historia<br>con música.',
    'anos18.stat1': 'Eventos realizados',
    'anos18.stat2': 'Personas impactadas',
    'anos18.stat3': 'Marcas asociadas',
    'anos18.stat4': 'Clientes satisfechos',

    'faixa.text': 'Crear experiencias que marcan la vida de las personas.',

    'tf.label': 'Transformación',
    'tf.title1': 'El efecto',
    'tf.semTag': 'Sin HIT',
    'tf.comTag': 'Con HIT',
    'tf.sem1': 'Marca invisible en el entretenimiento',
    'tf.sem2': 'Eventos sin estrategia de marca',
    'tf.sem3': 'Público disperso y no fidelizado',
    'tf.sem4': 'Inversión sin medición',
    'tf.sem5': 'Campañas genéricas y olvidables',
    'tf.com1': 'Marca protagonista en la cultura',
    'tf.com2': 'Eventos como plataforma estratégica',
    'tf.com3': 'Comunidad comprometida y monetizable',
    'tf.com4': 'ROI claro y medible',
    'tf.com5': 'Experiencias que se vuelven memoria',

    'sim.label': 'Simulador',
    'sim.title': '¿Cuál es el <em>objetivo</em> de tu marca?',
    'sim.sub': 'Selecciona y descubre cómo HIT crea el resultado.',
    'sim.opt1': 'Branding',
    'sim.opt2': 'Engagement',
    'sim.opt3': 'Eventos',
    'sim.opt4': 'Ingresos',
    'sim.placeholder': 'Selecciona un objetivo al lado',
    'sim.bra.tag': 'Branding',
    'sim.bra.title': 'Tu marca se vuelve <em>inconfundible</em>',
    'sim.bra.desc': 'Con música estratégica alineada a la identidad de la marca, creamos una firma sonora que se instala en la memoria del consumidor — haciendo cada punto de contacto reconocible y emocional.',
    'sim.bra.li1': 'Firma sonora exclusiva',
    'sim.bra.li2': 'Jingles y bandas para campañas',
    'sim.bra.li3': 'Identidad musical completa',
    'sim.eng.tag': 'Engagement',
    'sim.eng.title': 'Espectadores se vuelven <em>fans</em>',
    'sim.eng.desc': 'Creamos experiencias musicales que transforman audiencias pasivas en comunidades activas — personas que recomiendan, comparten y se vuelven embajadoras orgánicas de tu marca.',
    'sim.eng.li1': 'Activaciones en vivo y digitales',
    'sim.eng.li2': 'Contenido musical para redes sociales',
    'sim.eng.li3': 'Campañas de contenido generado por usuarios',
    'sim.eve.tag': 'Eventos',
    'sim.eve.title': 'Shows que se vuelven <em>resultados</em>',
    'sim.eve.desc': 'Producimos y curamos experiencias en vivo que conectan marcas con el público en momentos de alta emoción — desde Villa Mix Festival hasta activaciones corporativas de alto impacto.',
    'sim.eve.li1': 'Curaduría de artistas y line-up',
    'sim.eve.li2': 'Producción de eventos corporativos',
    'sim.eve.li3': 'Patrocinio y branding en festivales',
    'sim.rec.tag': 'Ingresos',
    'sim.rec.title': 'El entretenimiento se vuelve <em>ROI</em>',
    'sim.rec.desc': 'Convertimos músicos y artistas en activos de marca — y transformamos eventos y experiencias culturales en canales de ingresos medibles con retorno comprobado.',
    'sim.rec.li1': 'Modelos de monetización de fans',
    'sim.rec.li2': 'Nexus Club — ingresos recurrentes',
    'sim.rec.li3': 'Licenciamiento y derechos musicales',
    'sim.cta': 'Conversemos',

    'nexus.label': 'Producto Exclusivo',
    'nexus.title1': 'Nexus',
    'nexus.title2': 'Club.',
    'nexus.desc': 'Una comunidad cerrada que transforma público en base, base en relación — y relación en ingresos recurrentes y sostenibles.',
    'nexus.cta': 'Quiero ser parte',
    'nexus.p1.title': 'Comunidad',
    'nexus.p1.desc': 'Red curada de marcas, talentos y decisores del mercado de música y entretenimiento.',
    'nexus.p2.title': 'Gamificación',
    'nexus.p2.desc': 'Mecánicas de engagement continuo que mantienen al público activo, recompensado y conectado.',
    'nexus.p3.title': 'Ingresos',
    'nexus.p3.desc': 'Modelos de monetización que convierten la base de fans en flujo de ingresos previsible y recurrente.',
    'nexus.p4.title': 'Experiencias',
    'nexus.p4.desc': 'Acceso privilegiado a eventos, bastidores y momentos que solo los miembros de Nexus viven.',

    'cta.l1': 'Si es HIT, es sentimiento.',
    'cta.l2': 'Si es sentimiento, se vuelve memoria.',
    'cta.l3': 'Y la memoria se vuelve valor.',
    'cta.l4': 'Si es HIT, es éxito.',
    'cta.sub': 'Transforma tu marca en algo<br>que las personas sientan.',
    'cta.btn': 'Hablar con HIT',

    'footer.tagline': 'Si es HIT,<br><em>es éxito.</em>',
    'footer.address': 'Rua Luigi Galvani, 70 – 12º piso<br>Itaim Bibi – São Paulo – SP<br>04575-020 – Brasil',
    'footer.redes': 'Redes',
    'footer.contatoTitle': 'Contacto',
    'footer.nav': 'Navegación',
    'footer.ecossistema': 'Ecosistema',
    'footer.portfolio': 'Portafolio',
    'footer.copyright': '© 2026 HIT Music Business. Todos los derechos reservados.',
    'footer.bottomRight': 'Music Business · São Paulo · Brasil'
  },

  zh: {
    'nav.manifesto': '宣言',
    'nav.servicos': '服务',
    'nav.cases': '案例',
    'nav.simulador': '模拟器',
    'nav.nexus': 'Nexus 俱乐部',
    'nav.contato': '联系',

    'loader.label': '正在加载体验',
    'loader.tagline': '是 HIT，就是成功！',

    'hero.eyebrow': '音乐的力量是我们工作的明星',
    'hero.title1': '音乐是核心',
    'hero.title2': '我们所做的一切。',
    'hero.sub': '音乐是连接、记忆与情感。',
    'hero.btnExplorar': '探索',
    'hero.btnFalar': '联系 HIT',
    'hero.scroll': '滚动',
    'hero.tagline': '是 HIT，就是成功！',
    'hero.st0': '音乐讲述着人们的故事。',
    'hero.st1': '音乐创造连接。',
    'hero.st2': '连接创造记忆。',
    'hero.st3': '记忆创造价值。',
    'hero.st4': '价值创造商业。',

    'manifesto.label': '宣言',
    'manifesto.lead': '18 年来，我们通过最人性化的事物——音乐——将品牌与人们连接在一起。我们不做娱乐——我们书写历史。',
    'manifesto.quote1': '"我们不做',
    'manifesto.quote2': '广告。',
    'manifesto.quote3': '我们创造连接。"',
    'manifesto.sub': '创造能在人们生命中留下印记的体验。',
    'manifesto.q1': '"当我们策略性地使用音乐时，我们将普通信息转化为与观众产生情感共鸣的体验。"',
    'manifesto.q2': '"音乐贯穿我们生命的每一刻，从出生到告别，标记故事、塑造身份、唤起独特的情感。"',
    'manifesto.q3': '"我们热爱音乐，因为它以任何其他媒介都无法企及的方式转化、拉近并放大信息。"',
    'manifesto.qAuthor': 'Fabio Lopes — HIT Music Business 创始人',

    'eco.label': '生态系统',
    'eco.title': '我们的业务',
    'eco.desc': '六大战略方向<br>将音乐转化为品牌成果。',
    'eco.c1.title': '音乐品牌战略',
    'eco.c1.desc': '我们将品牌与音乐的情感力量连接，打造独特定位。',
    'eco.c2.title': '体验与激活',
    'eco.c2.desc': '超越平凡的瞬间，创造持久的情感记忆。',
    'eco.c3.title': '活动与演出',
    'eco.c3.desc': '将娱乐与品牌战略相结合的活动制作。',
    'eco.c4.title': '艺术家连接',
    'eco.c4.desc': '在品牌与音乐人才之间进行策展与匹配。',
    'eco.c5.title': '平台与技术',
    'eco.c5.desc': '数字基础设施，扩大覆盖面并衡量成效。',
    'eco.c6.title': '互动与社区',
    'eco.c6.desc': '我们建立成为品牌大使的粉丝群体。',
    'eco.st1': '音乐不是配角。',
    'eco.st2': '它是核心。',
    'eco.stSub': '它连接、激活、影响并持久存在。',

    'pf.label': '经验',
    'pf.title': '留下印记的<br>案例。',
    'pf.subtitle': '创造记忆的体验。<br>创造价值的记忆。',
    'pf.phrase': '我们创造的不仅是发生的体验… <strong>更是留存的体验。</strong>',
    'pf.case1.title': 'Especial Amigos',
    'pf.case1.tag': 'TV Globo',
    'pf.case1.desc': '巴西电视史上最大的音乐特辑，将最伟大的乡村音乐人聚集于同一舞台。',
    'pf.case2.title': 'Villa Mix Festival',
    'pf.case2.tag': '世界最大舞台 · 吉尼斯纪录',
    'pf.case3.title': 'Villa Mix',
    'pf.case3.tag': '戈亚尼亚',
    'anos18.tagline': '十八年<br>用音乐<br>书写历史。',
    'anos18.stat1': '已举办活动',
    'anos18.stat2': '触达人数',
    'anos18.stat3': '合作品牌',
    'anos18.stat4': '满意客户',

    'faixa.text': '创造能在人们生命中留下印记的体验。',

    'tf.label': '转变',
    'tf.title1': '其效应',
    'tf.semTag': '没有 HIT',
    'tf.comTag': '有 HIT',
    'tf.sem1': '品牌在娱乐中隐形',
    'tf.sem2': '活动缺乏品牌战略',
    'tf.sem3': '受众分散且不忠诚',
    'tf.sem4': '投资无法衡量',
    'tf.sem5': '通用且易被遗忘的活动',
    'tf.com1': '品牌成为文化主角',
    'tf.com2': '活动作为战略平台',
    'tf.com3': '活跃且可变现的社区',
    'tf.com4': '清晰可衡量的投资回报',
    'tf.com5': '化为记忆的体验',

    'sim.label': '模拟器',
    'sim.title': '您品牌的<em>目标</em>是什么？',
    'sim.sub': '请选择，发现 HIT 如何创造结果。',
    'sim.opt1': '品牌建设',
    'sim.opt2': '互动',
    'sim.opt3': '活动',
    'sim.opt4': '收入',
    'sim.placeholder': '请在左侧选择目标',
    'sim.bra.tag': '品牌建设',
    'sim.bra.title': '您的品牌变得<em>独一无二</em>',
    'sim.bra.desc': '通过与品牌身份契合的策略性音乐，我们打造扎根于消费者记忆的声音标识——让每个接触点都可识别且充满情感。',
    'sim.bra.li1': '专属声音标识',
    'sim.bra.li2': '广告歌与活动配乐',
    'sim.bra.li3': '完整的音乐识别',
    'sim.eng.tag': '互动',
    'sim.eng.title': '观众变成<em>粉丝</em>',
    'sim.eng.desc': '我们打造将被动观众转化为活跃社区的音乐体验——他们会推荐、分享，并自发成为您品牌的大使。',
    'sim.eng.li1': '现场与数字激活',
    'sim.eng.li2': '社交媒体音乐内容',
    'sim.eng.li3': '用户生成内容活动',
    'sim.eve.tag': '活动',
    'sim.eve.title': '演出变成<em>成果</em>',
    'sim.eve.desc': '我们制作并策划现场体验，在情感高点将品牌与观众连接——从 Villa Mix Festival 到高影响力的企业激活。',
    'sim.eve.li1': '艺人策展与阵容',
    'sim.eve.li2': '企业活动制作',
    'sim.eve.li3': '音乐节赞助与品牌',
    'sim.rec.tag': '收入',
    'sim.rec.title': '娱乐转化为<em>投资回报</em>',
    'sim.rec.desc': '我们将音乐人与艺术家转化为品牌资产——并将活动和文化体验转化为可衡量、回报可证实的收入渠道。',
    'sim.rec.li1': '粉丝变现模式',
    'sim.rec.li2': 'Nexus 俱乐部 — 经常性收入',
    'sim.rec.li3': '音乐授权与版权',
    'sim.cta': '让我们聊聊',

    'nexus.label': '专属产品',
    'nexus.title1': 'Nexus',
    'nexus.title2': '俱乐部。',
    'nexus.desc': '一个封闭的社区，将受众转化为基础，将基础转化为关系——并将关系转化为可持续的经常性收入。',
    'nexus.cta': '我想加入',
    'nexus.p1.title': '社区',
    'nexus.p1.desc': '由品牌、人才和音乐娱乐市场决策者组成的精心策划网络。',
    'nexus.p2.title': '游戏化',
    'nexus.p2.desc': '持续的互动机制，让受众保持活跃、获得奖励并保持连接。',
    'nexus.p3.title': '收入',
    'nexus.p3.desc': '将粉丝群转化为可预测、经常性收入流的变现模式。',
    'nexus.p4.title': '体验',
    'nexus.p4.desc': '专享活动、幕后和只有 Nexus 会员才能体验的时刻。',

    'cta.l1': '是 HIT，就是感觉。',
    'cta.l2': '是感觉，就成为记忆。',
    'cta.l3': '记忆便成为价值。',
    'cta.l4': '是 HIT，就是成功。',
    'cta.sub': '让您的品牌成为<br>人们能够感受到的存在。',
    'cta.btn': '联系 HIT',

    'footer.tagline': '是 HIT，<br><em>就是成功。</em>',
    'footer.address': 'Rua Luigi Galvani, 70 – 12 楼<br>Itaim Bibi – 圣保罗 – SP<br>04575-020 – 巴西',
    'footer.redes': '社交媒体',
    'footer.contatoTitle': '联系',
    'footer.nav': '导航',
    'footer.ecossistema': '生态系统',
    'footer.portfolio': '案例集',
    'footer.copyright': '© 2026 HIT Music Business. 版权所有。',
    'footer.bottomRight': 'Music Business · 圣保罗 · 巴西'
  }
}

/* ─────────────────────────────────────────────
   I18N — APLICA TRADUÇÕES
───────────────────────────────────────────── */
function applyTranslations(lang) {
  const dict = I18N[lang] || I18N.pt
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const val = dict[key]
    if (val != null) el.textContent = val
  })
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html')
    const val = dict[key]
    if (val != null) el.innerHTML = val
  })
}

/* ─────────────────────────────────────────────
   SELETOR DE IDIOMA (bandeirinhas no menu)
───────────────────────────────────────────── */
;(() => {
  const langGroup = document.getElementById('navLang')
  if (!langGroup) return

  const flags = langGroup.querySelectorAll('.nav__flag')
  const brFlag = langGroup.querySelector('[data-lang="pt"]')

  const STORAGE_KEY = 'hit-lang'
  const setLang = lang => {
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang)
    applyTranslations(lang)

    flags.forEach(f => f.classList.remove('is-active'))
    if (lang === 'pt') {
      brFlag.classList.add('is-hidden')
    } else {
      brFlag.classList.remove('is-hidden')
      langGroup.querySelector(`[data-lang="${lang}"]`)?.classList.add('is-active')
    }

    try { localStorage.setItem(STORAGE_KEY, lang) } catch (_) {}
  }

  flags.forEach(flag => {
    flag.addEventListener('click', () => setLang(flag.dataset.lang))
  })

  // Restaura preferência salva
  let saved = 'pt'
  try { saved = localStorage.getItem(STORAGE_KEY) || 'pt' } catch (_) {}
  if (I18N[saved] && saved !== 'pt') setLang(saved)
})()

console.log('%c🎵 HIT Music Business — Se é HIT, é Sucesso!', 'color: #e4c079; font-size: 16px; font-weight: bold;')
