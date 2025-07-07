const canvas = document.getElementById('arrow-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: null, y: null };
let arrows = [];

const spacing = 40;
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
        this.angle = Math.PI / 2; // Start facing straight up
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

        // Color shift based on proximity
        const distance = this.getDistanceToMouse();
        if (distance < 150) {
            ctx.strokeStyle = '#FF0000'; // Red when close
        } else {
            ctx.strokeStyle = '#00FF00'; // Green when far
        }

        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    update() {
        if (mouse.x === null || mouse.y === null) {
            // No mouse on screen — rotate back to vertical
            this.angle += (Math.PI / 2 - this.angle) * 0.05;
            return;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDist = 200;

        if (distance < maxDist) {
            let targetAngle = Math.atan2(dy, dx);
            let influence = (maxDist - distance) / maxDist;
            this.angle += (targetAngle - this.angle) * influence * 0.2; // More responsive
        } else {
            // Smoothly return to vertical
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
