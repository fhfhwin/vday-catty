const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "เด็กอ้วนไม่เอา",
    "ที่รักแน่ใจเหรอ? 🤔",
    "น้องแคทได้โปรดเถอะนะ... 🥺",
    "ถ้าอ้วนบอกไม่ วินท์จะเศร้ามากเลยนะ...",
    "เค้าจะเสียใจมากๆ เลย... 😢",
    "ได้โปรด??? 💔",
    "อย่าทำแบบนี้กับฉันเลย...",
    "โอกาสสุดท้ายแล้วนะอ้วน! 😭",
    "ยังไงก็จับเค้าไม่ได้หรอก 😜"
]

const yesTeasePokes = [
    "ลองกดไม่เอาก่อนสิ... อยากรู้ไหมว่าจะเกิดอะไรขึ้น 😏",
    "กดไม่เอาสิจ่า... เด็กอ้วงงง 👀",
    "พลาดอะไรดีๆ ไปน่าหน่อง 😈",
    "กดไม่เอาสิจ่า Comon เบบี๋ 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => { })
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time (capped for mobile)
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    const maxFontSize = Math.min(window.innerWidth * 0.12, 60)
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.25, maxFontSize)}px`
    const padY = Math.min(14 + noClickCount * 4, 40)
    const padX = Math.min(36 + noClickCount * 8, 80)
    yesBtn.style.padding = `${padY}px ${padX}px`
    yesBtn.style.maxWidth = '85vw'

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const padding = 30
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight

    // Keep the button safely within the viewport
    const minX = padding
    const minY = padding
    const maxX = Math.max(padding, window.innerWidth - btnW - padding)
    const maxY = Math.max(padding, window.innerHeight - btnH - padding)

    const randomX = Math.random() * (maxX - minX) + minX
    const randomY = Math.random() * (maxY - minY) + minY

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
