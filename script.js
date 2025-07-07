const canvas = document.getElementById('arrow-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: null, y: null };
let arrows = [];

const spacing = 40; // grid spacing
const arrowSize = 10;

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
        this.angle = 0;
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
        
        ctx.strokeStyle = '#00FFAA';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        if (mouse.x === null || mouse.y === null) return;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let influence = Math.max(0, 1 - distance / 300);

        let targetAngle = Math.atan2(dy, dx);

        this.angle += (targetAngle - this.angle) * influence * 0.1;
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
