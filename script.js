const magneticBg = document.querySelector('.magnetic-bg');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    magneticBg.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 150, 255, 0.3) 0%, transparent 50%)`;
});

