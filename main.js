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

    const MIN_D2 = 0.75 * 0.75   // distância mínima → evita repetir o mesh
    const MAX_D2 = 2.3 * 2.3     // evita cordas antipodais estranhas
    const TARGET = 55
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

    // ── Desenhar linhas (conexões) — mar mais suave, terra mais visível ──
    ctx.lineWidth = 0.5
    for (let k = 0; k < connections.length; k++) {
      const [i, j] = connections[k]
      const a = proj[i], b = proj[j]
      const zAvg = (a.z + b.z) * 0.5
      if (zAvg < -0.3) continue
      const bothLand = points[i].land && points[j].land
      const alpha = bothLand ? 0.42 : 0.14
      ctx.strokeStyle = goldColor(zAvg, alpha)
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
      const size = (0.8 + (p.z + 1) * 1.15) * (isLandPt ? 1 : 0.7)
      const alpha = isLandPt ? 0.95 : 0.32
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

console.log('%c🎵 HIT Music Business — Se é HIT, é Sucesso!', 'color: #e4c079; font-size: 16px; font-weight: bold;')
