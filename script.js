import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAhmC8Hs2eWUdwgrDHPIFH0UGMiVrCAUbc",
    authDomain: "shreeranga3-d5576.firebaseapp.com",
    projectId: "shreeranga3-d5576",
    storageBucket: "shreeranga3-d5576.firebasestorage.app",
    messagingSenderId: "222207444269",
    appId: "1:222207444269:web:3d60a7607906c51b45bfa4",
    measurementId: "G-ZH71B94YR7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️",
    "Noooooooooooo",
    "Pleaseeeeeeeee",
    "I will cry if you say no...",
];

let messageIndex = 0;
// Local images found in the images/ folder
const images = [
    'images/cat.png',
    'images/cat0.png',
    'images/cat1.png',
    'images/cat2.png',
    'images/cat3.png',
    'images/cat4.png'
];

let imageIndex = 0;
let noButtonEl;
let yesButtonEl;
let imgEl;
let mainContainerEl;
let yesContainerEl;
let statusEl;

function cacheElements() {
    noButtonEl = document.querySelector('.no-button');
    yesButtonEl = document.querySelector('.yes-button');
    imgEl = document.querySelector('.gif_container img');
    mainContainerEl = document.querySelector('.main-container');
    yesContainerEl = document.querySelector('.yes-container');
    statusEl = document.querySelector('.status-text');
}

function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#d32f2f' : '#2e7d32';
}

function handleNoClick() {
    if (!noButtonEl || !yesButtonEl) {
        cacheElements();
    }
    if (!noButtonEl || !yesButtonEl) return;

    noButtonEl.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButtonEl).fontSize);
    yesButtonEl.style.fontSize = `${currentSize * 1.5}px`;

    // Change the displayed image to the next one in the images array (skip the initial image)
    if (!imgEl) {
        imgEl = document.querySelector('.gif_container img');
    }
    if (imgEl && images.length > 1) {
        // show current imageIndex (starts at 1 after load), then advance
        imgEl.src = images[imageIndex];
        imageIndex = imageIndex + 1;
        if (imageIndex >= images.length) imageIndex = 1; // wrap back to 1, never 0
    }
}

async function handleYesClick() {
    if (!mainContainerEl || !yesContainerEl) {
        cacheElements();
    }
    if (mainContainerEl && yesContainerEl) {
        mainContainerEl.classList.add('hidden');
        yesContainerEl.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Save response to Firestore
    try {
        await setDoc(doc(db, "responses", "valentine"), { yes: true }, { merge: true });
        setStatus('Saved ✅');
    } catch (error) {
        console.error("Failed to save response:", error);
        setStatus('Save failed. Check Firestore rules/console.', true);
    }
}

// Ensure the page starts with the first local image (fallback: replace external gif)
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    if (noButtonEl) {
        noButtonEl.addEventListener('click', handleNoClick);
    }
    if (yesButtonEl) {
        yesButtonEl.addEventListener('click', handleYesClick);
    }
    // Preload images to reduce flicker when switching
    images.forEach((src) => {
        const preloadImg = new Image();
        preloadImg.src = src;
    });
    if (!imgEl) {
        const container = document.querySelector('.gif_container') || document.body;
        imgEl = document.createElement('img');
        container.appendChild(imgEl);
    }
    // Set initial image to the first local image if available
    if (images.length > 0) {
        // show the initial image once
        imgEl.src = images[0];
        imgEl.alt = 'Cute picture';
        // set next image index to 1 so subsequent cycles skip the initial image
        imageIndex = images.length > 1 ? 1 : 0;
    }
});