// script.js

document.addEventListener('DOMContentLoaded', () => {
    const entryPage = document.querySelector('.entry-page');
    const ticTacToePage = document.querySelector('.tic-tac-toe');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('resetBtn');
    const startBtn = document.getElementById('startBtn');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const player2NameContainer = document.getElementById('player2NameContainer');
    const modeInputs = document.getElementsByName('mode');
    let currentPlayer;
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let player1, player2;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Event listener for mode selection
    modeInputs.forEach(input => {
        input.addEventListener('change', () => {
            const selectedMode = document.querySelector('input[name="mode"]:checked').value;
            togglePlayer2NameInput(selectedMode === 'friends');
        });
    });

    startBtn.addEventListener('click', () => {
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const player1Name = player1NameInput.value.trim();

        if (mode === 'friends') {
            const player2Name = player2NameInput.value.trim();
            if (validateNames(player1Name, player2Name)) {
                startGameWithFriends(player1Name, player2Name);
            }
        } else if (mode === 'ai') {
            if (validateAiName(player1Name)) {
                startGameWithAi(player1Name);
            }
        }
    });

    const validateNames = (name1, name2) => {
        if (name1 === '' || name2 === '') {
            alert('Please enter names for both players.');
            return false;
        }
        if (name1 === name2) {
            alert('Player names must be different.');
            return false;
        }
        return true;
    };

    const validateAiName = (name) => {
        if (name === '') {
            alert('Please enter your name.');
            return false;
        }
        return true;
    };

    const startGameWithFriends = (name1, name2) => {
        player1 = { name: name1, symbol: 'O', isHuman: true };
        player2 = { name: name2, symbol: 'X', isHuman: true };
        currentPlayer = player1;
        gameActive = true;
        entryPage.classList.add('hidden');
        ticTacToePage.classList.remove('hidden');
        message.textContent = `${player1.name}'s turn`;
        resetGame();
    };

    const startGameWithAi = (name) => {
        player1 = { name: name, symbol: 'O', isHuman: true };
        player2 = { name: 'Computer', symbol: 'X', isHuman: false };
        currentPlayer = player1;
        gameActive = true;
        entryPage.classList.add('hidden');
        ticTacToePage.classList.remove('hidden');
        message.textContent = `${player1.name}'s turn`;
        resetGame();

        if (!player1.isHuman) {
            setTimeout(makeAiMove, 500); // Delay AI move for better user experience
        }
    };

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        updateCell(clickedCell, clickedCellIndex);
        checkResult();

        if (gameActive && currentPlayer === player2 && !player2.isHuman) {
            setTimeout(makeAiMove, 500); // Delay AI move for better user experience
        }
    };

    const updateCell = (clickedCell, index) => {
        board[index] = currentPlayer.symbol;
        clickedCell.textContent = currentPlayer.symbol;
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkResult = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            message.textContent = `Player ${currentPlayer.name} has won!`;
            displayWinnerAnimation(currentPlayer.name);
            gameActive = false;
            return;
        }

        const roundDraw = !board.includes('');
        if (roundDraw) {
            message.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        changePlayer();
        message.textContent = `${currentPlayer.name}'s turn`;
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.textContent = '');
        message.textContent = `${player1.name}'s turn`;
    };

    const makeAiMove = () => {
        const availableCells = [];
        board.forEach((cell, index) => {
            if (cell === '') {
                availableCells.push(index);
            }
        });

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const randomCellIndex = availableCells[randomIndex];

        const cellElement = cells[randomCellIndex];
        updateCell(cellElement, randomCellIndex);
        checkResult();
    };

    const displayWinnerAnimation = (winnerName) => {
        const winningMessage = document.createElement('div');
        winningMessage.textContent = `${winnerName} wins!`;
        winningMessage.classList.add('win-animation');
        message.appendChild(winningMessage);
        setTimeout(() => {
            winningMessage.remove();
        }, 2000);
    };

    const togglePlayer2NameInput = (show) => {
        player2NameContainer.style.display = show ? 'block' : 'none';
    };

    resetBtn.addEventListener('click', () => {
        entryPage.classList.remove('hidden');
        ticTacToePage.classList.add('hidden');
        gameActive = false;
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
});
