// View navigation
const views = document.querySelectorAll(".view");
const continueBtn = document.getElementById("continueBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const proposalView = document.getElementById("proposal");
const memoryPromptBtn = document.getElementById("memoryPromptBtn");
const memoryChoices = document.querySelectorAll(".memory-choice");
const memoryVideo = document.getElementById("memoryVideo");
const finalOverlay = document.getElementById("finalOverlay");
const backgroundMusic = document.getElementById("backgroundMusic");

function showView(id) {
  views.forEach((view) => {
    view.classList.toggle("is-active", view.id === id);
  });
}

continueBtn.addEventListener("click", () => {
  showView("proposal");
  backgroundMusic.play().catch(() => {});
});

// Template switcher
const templateButtons = document.querySelectorAll(".template-button");
const templateClassNames = ["template-minimal", "template-collage", "template-video"];

templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    templateButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    proposalView.classList.remove(...templateClassNames);
    proposalView.classList.add(`template-${button.dataset.template}`);
  });
});

// Rotating slideshow
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove("is-active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("is-active");
}, 3400);

// Floating hearts animation
const heartLayer = document.querySelector(".floating-hearts");
const heartSymbols = ["♥", "♡", "❤"];

function createFloatingHeart() {
  if (!proposalView.classList.contains("is-active")) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${5 + Math.random() * 4}s`;
  heart.style.animationDelay = `${Math.random() * 0.4}s`;
  heartLayer.appendChild(heart);

  heart.addEventListener("animationend", () => heart.remove());
}

setInterval(createFloatingHeart, 520);

// Funny NO button movement
function moveNoButton() {
  const buttonRect = noBtn.getBoundingClientRect();
  const padding = 18;
  const maxX = Math.max(padding, window.innerWidth - buttonRect.width - padding);
  const maxY = Math.max(padding, window.innerHeight - buttonRect.height - padding);
  const nextX = padding + Math.random() * (maxX - padding);
  const nextY = padding + Math.random() * (maxY - padding);

  noBtn.classList.add("is-running");
  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

// Celebration confetti and hearts burst
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiFrame;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
  confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function makeConfetti() {
  const colors = ["#ffffff", "#ffd1e6", "#ff6fa8", "#a45cff", "#ffe078"];
  confettiPieces = Array.from({ length: 170 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 5 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedX: (Math.random() - 0.5) * 14,
    speedY: -8 - Math.random() * 10,
    gravity: 0.22 + Math.random() * 0.08,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.25,
    shape: Math.random() > 0.35 ? "rect" : "heart"
  }));
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(12, 21);
  ctx.bezierCurveTo(5, 15, 1, 11, 1, 6.8);
  ctx.bezierCurveTo(1, 3.6, 3.6, 1, 6.8, 1);
  ctx.bezierCurveTo(8.8, 1, 10.6, 2, 12, 3.7);
  ctx.bezierCurveTo(13.4, 2, 15.2, 1, 17.2, 1);
  ctx.bezierCurveTo(20.4, 1, 23, 3.6, 23, 6.8);
  ctx.bezierCurveTo(23, 11, 19, 15, 12, 21);
  ctx.fill();
  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.speedY += piece.gravity;
    piece.rotation += piece.rotationSpeed;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);

    if (piece.shape === "heart") {
      drawHeart(0, 0, piece.size * 2, piece.color);
    } else {
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.6);
    }

    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.y < window.innerHeight + 80);

  if (confettiPieces.length) {
    confettiFrame = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(confettiFrame);
  }
}

function startCelebration() {
  resizeCanvas();
  makeConfetti();
  animateConfetti();
}

yesBtn.addEventListener("click", () => {
  showView("celebration");
  startCelebration();
});

window.addEventListener("resize", resizeCanvas);

// Memory lane flow
memoryPromptBtn.addEventListener("click", () => {
  showView("memory");
});

memoryChoices.forEach((button) => {
  button.addEventListener("click", () => {
    showView("memoriesVideo");
    finalOverlay.classList.remove("is-visible");
    memoryVideo.currentTime = 0;
    memoryVideo.play().catch(() => {});
  });
});

memoryVideo.addEventListener("ended", () => {
  finalOverlay.classList.add("is-visible");
});

// Keep videos decorative and quiet until user replaces media
document.querySelectorAll("video").forEach((video) => {
  video.controls = false;
});
