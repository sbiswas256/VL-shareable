/**
 * Project Configuration for Chapter Cards
 * Add or update embedded links and card titles here.
 */
const CHAPTER_CONFIG = {
    "cell-division": {
        introVideo: "https://www.canva.com/design/DAHG2eCMoWc/HmsEwoBr8TWiK-xI0X1Vng/view?embed",
        cards: [
            { title: "Types of Cell Division", url: "https://www.canva.com/design/DAHI0qAk18M/VX2r1sFXFBDuDAFBNpM1pg/view?embed" },
            { title: "Introduction to Cell Organelles", url: "https://www.canva.com/design/DAHG2Y_BXk8/OI1dp0iP8AXge_K4ojroEw/view?embed" },
            { title: "Cell Cycle", url: "https://www.canva.com/design/DAHDk-j_T6g/95W6KWwm-TP7Qol8dkjasA/view?embed" },
            { title: "Interphase", url: "https://www.canva.com/design/DAHG2XQ2jUs/MBT6o3jxbG9oDGjnbI0HfQ/view?embed" },
            { title: "M-Phase Cell Division", url: "https://www.canva.com/design/DAHG2VQYTqY/5biYB-q88kAtEu__XGH6Iw/view?embed" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" }
        ]
    },
    "chromosome": {
        introVideo: "", // Add intro video URL here when available
        cards: [
            { title: "Types and Parts Of Chromosom", url: "https://www.canva.com/design/DAHH4jwIe60/bMQC1D7gctmvGIxTRLGQcA/view?embed" },
            { title: "Chromosome-DNA relation", url: "https://www.canva.com/design/DAHH4wj_O-M/S1rLgrbruEW4n-CCMo8brA/view?embed" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" },
            { title: "Next Chapter coming soon", url: "" }
        ]
    },
    "dummy": {
        introVideo: "",
        cards: [
            { title: "Example Card 1", url: "" },
            { title: "Example Card 2", url: "" },
            { title: "Next Chapter coming soon", url: "" }
        ]
    }
};

// Function to populate chapter cards dynamically
function loadChapterCards(chapterId) {
    const config = CHAPTER_CONFIG[chapterId];
    if (!config) return;

    const container = document.querySelector('.container');
    if (!container) return;

    // Clear container (optional, but good for dynamic updates)
    container.innerHTML = '';

    // 1. Add Intro Video Card
    if (config.introVideo) {
        const introCard = document.createElement('div');
        introCard.className = 'card top-video-card';
        introCard.innerHTML = `
            <div class="intro-video-frame">
                <iframe src="${config.introVideo}" allowfullscreen loading="lazy"></iframe>
            </div>
            <div class="card-title">Introduction Video</div>
        `;
        container.appendChild(introCard);
    }

    // 2. Add Regular Cards
    config.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        if (card.url && card.url !== "") {
            cardDiv.innerHTML = `
                <div class="iframe-wrapper">
                    <iframe src="${card.url}" allowfullscreen loading="lazy" title="${card.title}"></iframe>
                    <div class="menu-blocker"></div>
                </div>
                <div class="card-title">${card.title}</div>
            `;
        } else {
            // Placeholder card
            cardDiv.innerHTML = `
                <div class="card-placeholder">COMING SOON</div>
                <div class="card-title">${card.title}</div>
            `;
        }
        container.appendChild(cardDiv);
    });

    // Re-initialize card interactions (focus, fullscreen, ripple) after dynamic loading
    initializeCardInteractions();
}

// Function to re-bind events to dynamically created cards
function initializeCardInteractions() {
    document.querySelectorAll('.card').forEach(card => {
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        // Enter key to toggle fullscreen
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!document.fullscreenElement) {
                    const target = card.querySelector('.iframe-wrapper') || card.querySelector('.intro-video-frame') || card;
                    target.requestFullscreen().catch(() => { });
                }
                e.preventDefault();
            }
        });

        // Double Click to toggle fullscreen
        card.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
                card.classList.add('zoom-disappear');
                const target = card.querySelector('.iframe-wrapper') || card.querySelector('.intro-video-frame') || card;
                target.requestFullscreen().then(() => {
                    setTimeout(() => card.classList.remove('zoom-disappear'), 500);
                }).catch(() => card.classList.remove('zoom-disappear'));
            }
        });

        // Ripple Effect
        card.addEventListener('pointerdown', function (e) {
            const existing = this.querySelector('.ripple');
            if (existing) existing.remove();

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = (size * 0.8) + 'px';
            ripple.style.left = (x - size * 0.4) + 'px';
            ripple.style.top = (y - size * 0.4) + 'px';

            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        }, { passive: true });

        // Track last focused card
        card.addEventListener('focus', () => {
            if (window.setLastFocusedCard) window.setLastFocusedCard(card);
        });
    });
}
