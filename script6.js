document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bubbleContainer');
    let mouseX = 0;
    let mouseY = 0;

    // 1. Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 2. Create Bubbles
    function createBubble() {
        const bubble = document.createElement('span');
        bubble.classList.add('bubble');

        // --- Random Color (50% Chance to be Purple) ---
        if (Math.random() > 0.5) {
            bubble.classList.add('purple');
        }

        // --- Random Size (Between 20px and 60px) ---
        // This makes some bubbles small and some large
        const size = Math.random() * 40 + 20; 
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';

        // --- Random Position (Left 0% to 100%) ---
        const positionX = Math.random() * 100;
        bubble.style.left = positionX + '%';

        // --- Random Speed (Slower for larger bubbles usually looks better) ---
        const speed = 15 + Math.random() * 15; 
        bubble.style.animationDuration = `${speed}s`;

        container.appendChild(bubble);

        // Remove bubble after animation ends
        setTimeout(() => {
            bubble.remove();
        }, speed * 1000);
    }

    // Generate bubbles every 300 milliseconds
    setInterval(createBubble, 300);

    // 3. The Avoidance Loop
    function animateBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        
        bubbles.forEach(bubble => {
            // Calculate center of the bubble
            const rect = bubble.getBoundingClientRect();
            const bubbleX = rect.left + rect.width / 2;
            const bubbleY = rect.top + rect.height / 2;

            // Calculate distance to mouse
            const distX = mouseX - bubbleX;
            const distY = mouseY - bubbleY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Interaction radius: 150px
            if (distance < 150) {
                const angle = Math.atan2(distY, distX);
                const force = (150 - distance) * 2; 

                // Push bubble away
                const moveX = Math.cos(angle) * force * -1;
                const moveY = Math.sin(angle) * force * -1;

                bubble.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                // Return to normal
                bubble.style.transform = `translate(0px, 0px)`;
            }
        });

        requestAnimationFrame(animateBubbles);
    }

    // Start the animation loop
    animateBubbles();
});