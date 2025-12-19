const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: undefined, 
    y: undefined,
    speed: 0,
    lastMove: 0
};

const particlesArray = [];
const candlesArray = [];
let secretAlpha = 0; // Tracks visibility of the "67"

function initCandles() {
    candlesArray.length = 0;
    const candleCount = 5;
    for (let i = 1; i <= candleCount; i++) {
        let x = (canvas.width / (candleCount + 1)) * i;
        let y = canvas.height - 50; 
        candlesArray.push(new Candle(x, y));
    }
}

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCandles();
});

window.addEventListener('mousemove', function(event){
    if (mouse.x !== undefined) {
        let dx = event.x - mouse.x;
        let dy = event.y - mouse.y;
        mouse.speed = Math.sqrt(dx * dx + dy * dy);
    }
    
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.lastMove = Date.now(); 

    if (mouse.speed < 150) {
        particlesArray.push(new Particle());
    }
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 8 + 4; 
        this.speedX = Math.random() * 2 - 1; 
        this.speedY = Math.random() * -2 - 1; 
        this.hue = 40; 
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.3;
        this.hue -= 2; 
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.closePath();
    }
}

class Candle {
    constructor(x, y) {
        this.x = x; 
        this.y = y; 
        this.width = 30;
        this.height = Math.random() * 80 + 50; 
        this.color = '#333'; 
        this.isLit = false;
        this.reIgniteTimer = 0; 
        this.wickX = this.x;
        this.wickY = this.y - this.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height, this.width, this.height);

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.wickX, this.wickY);
        ctx.lineTo(this.wickX, this.wickY - 10);
        ctx.stroke();

        if (this.reIgniteTimer > 0) this.reIgniteTimer--;

        if (mouse.x !== undefined) {
            let dx = mouse.x - this.wickX;
            let dy = mouse.y - (this.wickY - 10);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
                if (mouse.speed > 20 && this.isLit) {
                    this.isLit = false;
                    this.reIgniteTimer = 30; 
                } 
                else if (distance < 30 && mouse.speed < 20 && this.reIgniteTimer === 0) {
                    this.isLit = true;
                }
            }
        }

        if (this.isLit) {
            this.drawFlame();
            this.drawGlow();
        }
    }

    drawFlame() {
        const flameHeight = (Math.random() * 5) + 20; 
        const flameWidth = (Math.random() * 2) + 10;
        ctx.beginPath();
        ctx.moveTo(this.wickX - flameWidth/2, this.wickY - 10);
        ctx.quadraticCurveTo(this.wickX, this.wickY - 10 - flameHeight * 2, this.wickX + flameWidth/2, this.wickY - 10);
        ctx.quadraticCurveTo(this.wickX, this.wickY - 10, this.wickX - flameWidth/2, this.wickY - 10);
        ctx.fillStyle = '#ffcc00'; 
        ctx.fill();
        ctx.closePath();
    }

    drawGlow() {
        const gradient = ctx.createRadialGradient(this.wickX, this.wickY - 20, 5, this.wickX, this.wickY - 20, 180);
        gradient.addColorStop(0, 'rgba(255, 140, 0, 0.2)'); 
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); 
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.wickX, this.wickY - 20, 180, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- NEW FUNCTION: Draws the Giant 67 ---
function drawSecretNumber() {
    // Check if ALL candles are lit
    const allLit = candlesArray.every(c => c.isLit);

    // Fade In if all lit, Fade Out if not
    if (allLit && secretAlpha < 1) {
        secretAlpha += 0.02; // Fade in speed
    } else if (!allLit && secretAlpha > 0) {
        secretAlpha -= 0.05; // Fade out speed (faster)
    }

    // Only draw if visible
    if (secretAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = secretAlpha;
        
        // Dynamic font size based on screen width
        const fontSize = Math.min(canvas.width, canvas.height) * 0.5;
        ctx.font = `bold ${fontSize}px Courier New`;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Fire Text Color
        ctx.fillStyle = '#ff4400'; 
        
        // Add a "Glow" shadow to the text
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 40;
        
        ctx.fillText('67', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
}

function drawMouseLight() {
    if (typeof mouse.x !== 'number') return;
    try {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 150);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fill();
    } catch(e) {}
}

function handleParticles() {
    for (let i = particlesArray.length - 1; i >= 0; i--) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.3) particlesArray.splice(i, 1);
    }
    if (particlesArray.length > 100) particlesArray.shift();
}

function handleCandles() {
    for (let i = 0; i < candlesArray.length; i++) {
        candlesArray[i].draw();
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Date.now() - mouse.lastMove > 100) {
        mouse.speed = 0;
    }

    ctx.globalCompositeOperation = 'lighter'; 

    // Draw the secret number first so it appears "behind" the mouse fire
    drawSecretNumber();
    
    drawMouseLight();
    handleParticles();
    handleCandles();   
    
    ctx.globalCompositeOperation = 'source-over';
    
    requestAnimationFrame(animate);
}

initCandles();
animate();