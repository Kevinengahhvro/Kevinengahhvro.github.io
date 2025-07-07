const canvas = document.getElementById('arrow-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: null, y: null };
let arrows = [];

const spacing = 20;    // Smaller spacing = More arrows
const arrowSize = 6;   // Shrink arrow size so grid stays clean

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Arrow {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.PI / 2; // Default vertical
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(-arrowSize / 2, 0);
        ctx.lineTo(arrowSize / 2, 0);
        ctx.lineTo(arrowSize / 4, -arrowSize / 4);
        ctx.moveTo(arrowSize / 2, 0);
        ctx.lineTo(arrowSize / 4, arrowSize / 4);

        const distance = this.getDistanceToMouse();
        const maxDist = 150;
        const clampedDist = Math.min(distance, maxDist);
        const ratio = 1 - clampedDist / maxDist;

        const red = Math.floor(ratio * 255);
        const green = Math.floor((1 - ratio) * 255);
        ctx.strokeStyle = `rgb(${red}, ${green}, 0)`;

        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        if (mouse.x === null || mouse.y === null) {
            this.angle += (Math.PI / 2 - this.angle) * 0.05;
            return;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (distance < maxDist) {
            let targetAngle = Math.atan2(dy, dx);
            let influence = (maxDist - distance) / maxDist;
            this.angle += (targetAngle - this.angle) * influence * 0.3; // More responsive
        } else {
            this.angle += (Math.PI / 2 - this.angle) * 0.05;
        }
    }

    getDistanceToMouse() {
        if (mouse.x === null || mouse.y === null) return Infinity;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

function init() {
    arrows = [];
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            arrows.push(new Arrow(x, y));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrows.forEach(a => {
        a.update();
        a.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();
