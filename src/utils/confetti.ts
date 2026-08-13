// Confetti and falling stars animation trigger for positive reinforcement
export function triggerConfetti(count = 45): void {
  if (typeof document === 'undefined') return;

  const symbols = ['⭐', '🌟', '✨', '💫', '🦋', '🌸', '🎊', '🎉', '❤️', '🎈', '💎', '🌈', '🏆'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-item';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Randomize position, size, duration, and delay
    const leftPosition = Math.random() * 100; // 0 to 100vw
    const duration = 1.2 + Math.random() * 2.5; // 1.2s to 3.7s
    const delay = Math.random() * 0.8; // 0s to 0.8s
    const fontSize = 1.2 + Math.random() * 1.2; // 1.2rem to 2.4rem

    el.style.left = `${leftPosition}vw`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.fontSize = `${fontSize}rem`;

    document.body.appendChild(el);

    // Clean up DOM element when animation finishes
    el.addEventListener('animationend', () => {
      el.remove();
    });
  }
}
