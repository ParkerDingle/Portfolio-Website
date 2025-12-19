const game = () => {

    // Function to trigger fireworks
    const triggerFireworks = () => {
        const duration = 2000; // Fireworks last for 2 seconds
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Fire from left side
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            // Fire from right side
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };


    const startGame = () => {
        const playBtn = document.querySelectorAll('.options button');
        const playerHand = document.querySelector('.player-hand');
        const computerHand = document.querySelector('.computer-hand');
        const statusText = document.getElementById('status-text');

        const imageMap = {
            'rock': 'rock.png',
            'paper': 'paper.jpeg',
            'scissors': 'scissor.png'
        };

        const computerOptions = ['rock', 'paper', 'scissors'];

        playBtn.forEach(option => {
            option.addEventListener('click', function() {
                const playerChoice = this.getAttribute('data-choice');
                const computerNumber = Math.floor(Math.random() * 3);
                const computerChoice = computerOptions[computerNumber];

                // Reset to fists
                playerHand.src = 'fist.png';
                computerHand.src = 'fist.png';
                
                statusText.textContent = "Rock... Paper... Scissors...";
                statusText.style.color = "#e2e8f0"; 
                
                // Disable buttons
                playBtn.forEach(btn => btn.classList.add('disabled'));

                // Apply Shake
                playerHand.classList.add('shaking-player');
                computerHand.classList.add('shaking-computer');

                // Wait for animation
                setTimeout(() => {
                    // Update Images
                    playerHand.src = imageMap[playerChoice];
                    computerHand.src = imageMap[computerChoice];

                    // Check result
                    determineWinner(playerChoice, computerChoice);

                    // Re-enable
                    playBtn.forEach(btn => btn.classList.remove('disabled'));
                    
                    // Cleanup classes
                    playerHand.classList.remove('shaking-player');
                    computerHand.classList.remove('shaking-computer');

                }, 1200);
            });
        });
    };

    const determineWinner = (playerChoice, computerChoice) => {
        const status = document.getElementById('status-text');

        // TIE LOGIC
        if (playerChoice === computerChoice) {
            status.textContent = "NOU CHAMA";
            status.style.color = "#da3434ff"; 
            return;
        }

        if (playerChoice === 'rock') {
            if (computerChoice === 'scissors') {
                win(status); return;
            } else {
                lose(status); return;
            }
        }

        if (playerChoice === 'paper') {
            if (computerChoice === 'scissors') {
                lose(status); return;
            } else {
                win(status); return;
            }
        }

        if (playerChoice === 'scissors') {
            if (computerChoice === 'rock') {
                lose(status); return;
            } else {
                win(status); return;
            }
        }
    };

    const win = (statusElement) => {
        statusElement.textContent = "CHAMA!";
        statusElement.style.color = "#e2df35ff";
        // FIREWORKS TRIGGERED HERE
        triggerFireworks();
    }

    const lose = (statusElement) => {
        statusElement.textContent = "NOU CHAMA";
        statusElement.style.color = "#da3434ff";
    }

    startGame();
};

game();