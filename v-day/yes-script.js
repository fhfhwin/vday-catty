let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()

    // Autoplay music (works since user clicked Yes to get here)
    const music = document.getElementById('bg-music')
    music.volume = 0.3
    music.play().catch(() => { })
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'

    // Add click listeners to all postcard images
    document.querySelectorAll('.postcard').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img')
            if (img) openLightbox(img.src)
        })
    })

    // Start GIF slideshow
    startSlideshow()
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    // Initial big burst
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }

        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, 300)
}

// Lightbox functions
function openLightbox(src) {
    const overlay = document.getElementById('lightbox')
    const lightboxImg = document.getElementById('lightbox-img')
    lightboxImg.src = src
    overlay.classList.add('active')

    // Mini confetti burst at center 🎉
    const colors = ['#ff69b4', '#ff1493', '#ffb3c1', '#ffdf00', '#fff']
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors
    })
    // Side pops
    confetti({
        particleCount: 30,
        angle: 60,
        spread: 50,
        origin: { x: 0.15, y: 0.6 },
        colors
    })
    confetti({
        particleCount: 30,
        angle: 120,
        spread: 50,
        origin: { x: 0.85, y: 0.6 },
        colors
    })
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active')
}

function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

// GIF-like slideshow — smooth crossfade with preload
function startSlideshow() {
    const frame = document.getElementById('gif-frame')
    if (!frame) return

    const images = frame.querySelectorAll('img')
    if (images.length === 0) return

    // Preload all images into browser cache first
    let loaded = 0
    const srcs = Array.from(images).map(img => img.src)

    srcs.forEach(src => {
        const preImg = new Image()
        preImg.onload = preImg.onerror = () => {
            loaded++
            if (loaded >= srcs.length) {
                // All images loaded — start the animation
                runSlideshow(images)
            }
        }
        preImg.src = src
    })
}

function runSlideshow(images) {
    let current = 0
    let zIndex = 1

    setInterval(() => {
        const next = (current + 1) % images.length

        // Stack next image on top with higher z-index
        zIndex++
        images[next].style.zIndex = zIndex
        images[next].classList.add('active')

        // Remove old image after crossfade finishes
        const prev = current
        setTimeout(() => {
            images[prev].classList.remove('active')
            images[prev].style.zIndex = 0
        }, 400)

        current = next

        // Reset z-index every full cycle to prevent overflow
        if (current === 0) {
            zIndex = 1
        }
    }, 500)
}
