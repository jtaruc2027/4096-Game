document.addEventListener('DOMContentLoaded', () => {
    const GRID_SIZE = 5;
    let grid = [];
    let score = 0;
    let startTime = 0;
    let timerInterval;

    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');

    function initializeGrid() {
        grid = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            grid.push(new Array(GRID_SIZE).fill(0));
        }
    }

    function renderGrid() {
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }
        
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = cell !== 0 ? cell : '';
                tile.style.backgroundColor = getTileColor(cell);
                gridContainer.appendChild(tile);
            });
            gridContainer.appendChild(document.createElement('br'));
        });
    }

    function getTileColor(value) {
        switch (value) {
            case 2: return '#626eca';
            case 4: return '#7d4fc4';
            case 8: return '#8b62ca';
            case 16: return '#9975d1';
            case 32: return '#a788d7';
            case 64: return '#b59bdd';
            case 128: return '#c3aee4';
            case 256: return '#d1c1ea';
            case 512: return '#d59bdd';
            case 1024: return '#ddaee4';
            case 2048: return '#e7c7ec';
            case 4096: return '#f2e0f4';
            default: return '#4c5265';
        }
    }

    function generateRandomTile() {
        const availableCells = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell === 0) {
                    availableCells.push({ x: rowIndex, y: cellIndex });
                }
            });
        });

        if (availableCells.length > 0) {
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${currentTime}s`;
    }

    function isGameOver() {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col] === 0) {
                    return false;
                }
            }
        }

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const currentCell = grid[row][col];
                if ((row > 0 && grid[row - 1][col] === currentCell) ||
                    (row < GRID_SIZE - 1 && grid[row + 1][col] === currentCell) ||
                    (col > 0 && grid[row][col - 1] === currentCell) ||
                    (col < GRID_SIZE - 1 && grid[row][col + 1] === currentCell)) {
                    return false;
                }
            }
        }
        return true; 
    }

    function move(direction) {
        let moved = false;
        let has4096 = false;

        switch (direction) {
            case 'up':
                for (let col = 0; col < GRID_SIZE; col++) {
                    for (let row = 1; row < GRID_SIZE; row++) {
                        if (grid[row][col] !== 0) {
                            let currentRow = row;
                            while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
                                grid[currentRow - 1][col] = grid[currentRow][col];
                                grid[currentRow][col] = 0;
                                currentRow--;
                                moved = true;
                            }
                            if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
                                grid[currentRow - 1][col] *= 2;
                                score += grid[currentRow - 1][col];
                                grid[currentRow][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'down':
                for (let col = 0; col < GRID_SIZE; col++) {
                    for (let row = GRID_SIZE - 2; row >= 0; row--) {
                        if (grid[row][col] !== 0) {
                            let currentRow = row;
                            while (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === 0) {
                                grid[currentRow + 1][col] = grid[currentRow][col];
                                grid[currentRow][col] = 0;
                                currentRow++;
                                moved = true;
                            }
                            if (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === grid[currentRow][col]) {
                                grid[currentRow + 1][col] *= 2;
                                score += grid[currentRow + 1][col];
                                grid[currentRow][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'left':
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = 1; col < GRID_SIZE; col++) {
                        if (grid[row][col] !== 0) {
                            let currentCol = col;
                            while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
                                grid[row][currentCol - 1] = grid[row][currentCol];
                                grid[row][currentCol] = 0;
                                currentCol--;
                                moved = true;
                            }
                            if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
                                grid[row][currentCol - 1] *= 2;
                                score += grid[row][currentCol - 1];
                                grid[row][currentCol] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'right':
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = GRID_SIZE - 2; col >= 0; col--) {
                        if (grid[row][col] !== 0) {
                            let currentCol = col;
                            while (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === 0) {
                                grid[row][currentCol + 1] = grid[row][currentCol];
                                grid[row][currentCol] = 0;
                                currentCol++;
                                moved = true;
                            }
                            if (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === grid[row][currentCol]) {
                                grid[row][currentCol + 1] *= 2;
                                score += grid[row][currentCol + 1];
                                grid[row][currentCol] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
                
        }
        
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell === 4096) {
                    has4096 = true;
                }
            });
        });

        if(has4096) {
            const currentTime = Math.floor((Date.now() - startTime) / 1000);
            alert(`Congratulations! You reached 4096 in ${currentTime} seconds with a score of ${score}!`);
            clearGrid();
            return;
        }

        if (moved) {
            generateRandomTile();
            renderGrid();
            updateScore();
            
            if (isGameOver()) {
                alert("Game Over! Your score is: " + score);
                clearGrid();
            }
        }
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    }

    function clearGrid() {
        clearInterval(timerInterval); 
        initializeGrid(); 
        score = 0; 
        updateScore(); 
        startTime = Date.now(); 
        updateTimer(); 
        renderGrid(); 
    }   

    function startGame() {
        score = 0;
        initializeGrid();
        renderGrid();
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        generateRandomTile();
        generateRandomTile();
        updateScore();
        updateTimer();
        document.addEventListener('keydown', handleKeyPress);
    }

    document.getElementById('clear-button').addEventListener('click', clearGrid);
    document.getElementById('start').addEventListener('click', startGame);

    startGame();

});