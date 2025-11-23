
        const fruits = [' 🍎', '🍈', '🍒', '🍇', '🥭', '🍓', '🥝', '🍍', '🍉', '🍑'];
        const playerNameElement = document.getElementById('player-name');
        const attemptsLeftElement = document.getElementById('attempts-left');
        const winsElement = document.getElementById('wins');
        const reel1Element = document.getElementById('reel1');
        const reel2Element = document.getElementById('reel2');
        const reel3Element = document.getElementById('reel3');
        const resultElement = document.getElementById('result');
        const spinButton = document.getElementById('spin-btn');
        const newGameButton = document.getElementById('new-game-btn'); 
        let playerName = '';
        let attemptsLeft = 3;
        let isSpinning = false;
        let previousFruits = [[], [], []];  
        function askPlayerName() {
            let name = '';
            while (!name || name.trim() === '') {
                name = prompt("Введіть ваше ім'я:", "Гравець");
                if (name === null) {
                    name = "Гравець";    }    }
            playerName = name.trim();
            playerNameElement.textContent = playerName;     }     
        function initGame() {
            attemptsLeft = 3;
            isSpinning = false;
            previousFruits = [[], [], []];  
            resultElement.textContent = '';
            resultElement.className = 'result';   
            updateUI(); 
            fillReel(reel1Element, 0);
            fillReel(reel2Element, 1);
            fillReel(reel3Element, 2); 
            spinButton.disabled = false;      }      
        function generateUniqueFruits(reelIndex) {
            let newFruits = [];
            let attempts = 0;   
            do { newFruits = [...fruits];
                for (let i = newFruits.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newFruits[i], newFruits[j]] = [newFruits[j], newFruits[i]];    }
                attempts++;
            } while (arraysEqual(newFruits, previousFruits[reelIndex]) && attempts < 10);   
            previousFruits[reelIndex] = [...newFruits];    
            return newFruits;     }     
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;     }
            return true;   }   
        function fillReel(reelElement, reelIndex) {
            reelElement.innerHTML = '';    
            for (let i = 0; i < 10; i++) {
                const uniqueFruits = generateUniqueFruits(reelIndex);   
                uniqueFruits.forEach(fruit => {
                    const item = document.createElement('div');
                    item.className = 'slot-item';
                    item.textContent = fruit;
                    reelElement.appendChild(item);     });       }     }     
        function spinReels() {
            if (isSpinning || attemptsLeft <= 0) return;   
            isSpinning = true;
            spinButton.disabled = true;
            resultElement.textContent = '';
            resultElement.className = 'result';  
            attemptsLeft--;    
            const spinReel1 = spinReel(reel1Element, 0);
            const spinReel2 = spinReel(reel2Element, 1);
            const spinReel3 = spinReel(reel3Element, 2);   
            Promise.all([spinReel1, spinReel2, spinReel3]).then(() => {
                isSpinning = false;     
                checkResult();  
                updateUI();
                if (attemptsLeft <= 0) {
                    endGame();
                } else {
                    spinButton.disabled = false;     }      });    }    
        function spinReel(reelElement, reelIndex) {
            return new Promise(resolve => {
                fillReel(reelElement, reelIndex);    
                const items = reelElement.querySelectorAll('.slot-item');
                const itemHeight = items[0].offsetHeight;
                const spinDuration = 2000 + Math.random() * 1000; 
                const spinDistance = itemHeight * items.length;     
                let startTime = null;    
                function animate(time) {
                    if (!startTime) startTime = time;
                    const elapsed = time - startTime;
                    const progress = Math.min(elapsed / spinDuration, 1);   
                    const easing = 1 - Math.pow(1 - progress, 3);
                    const distance = spinDistance * easing;    
                    reelElement.style.top = `-${distance % (itemHeight * fruits.length)}px`;    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        const currentTop = parseInt(reelElement.style.top) || 0;
                        const offset = Math.abs(currentTop) % itemHeight;     
                        if (offset > itemHeight / 2) {
                            reelElement.style.top = `-${Math.abs(currentTop) + (itemHeight - offset)}px`;
                        } else {
                            reelElement.style.top = `-${Math.abs(currentTop) - offset}px`;           }           
                       resolve();        }      }      
                requestAnimationFrame(animate);    });  }  
        function checkResult() {
            const reels = [reel1Element, reel2Element, reel3Element];
            const resultRows = [[], [], []];   
            for (let row = 0; row < 3; row++) {
                reels.forEach(reel => {
                    const items = reel.querySelectorAll('.slot-item');
                    const itemHeight = items[0].offsetHeight;
                    const currentTop = Math.abs(parseInt(reel.style.top) || 0);
                    const itemIndex = Math.floor((currentTop + itemHeight * (row + 1)) / itemHeight) % items.length;        
                    resultRows[row].push(items[itemIndex].textContent);    });     }     
            let win = false;
            let winningRow = -1;     
            for (let i = 0; i < 3; i++) {
                if (resultRows[i][0] === resultRows[i][1] && resultRows[i][1] === resultRows[i][2]) {
                    win = true;
                    winningRow = i;
                    break;       }       }       
            if (win) {
                resultElement.textContent = `🏆 Вітаємо! Ви виграли з комбінацією ${resultRows[winningRow][0]}! 🏆`;
                resultElement.className = 'result win';
            } else {
                resultElement.textContent = 'Спробуйте ще раз!';
                resultElement.className = 'result lose';       }    }    
        function endGame() {
            spinButton.disabled = true;
            resultElement.textContent = 'Гра завершена!';
            resultElement.className = 'game-end';      }      
        function startNewGame() {
            askPlayerName();
            initGame();     }     
        function updateUI() {
            attemptsLeftElement.textContent = attemptsLeft;     }     
        spinButton.addEventListener('click', spinReels);
        newGameButton.addEventListener('click', startNewGame);  
        startNewGame();