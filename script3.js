
let tracker = 0;
const svgX = `<svg class="svg-x" data-aria-label="X" viewBox="0 0 128 128" width="88" height="88">
    <path d="M16,16L112,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0; stroke-width: 13;"></path>
    <path d="M112,16L16,112" style="stroke: rgb(84, 84, 84); stroke-dasharray: 135.764; stroke-dashoffset: 0; stroke-width: 13"></path>
</svg>`;

const svgO = `<svg class="svg-o" data-aria-label="O" viewBox="0 0 128 128" width="95" height="95">
    <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" 
    style="stroke: rgb(242, 235, 211); stroke-dasharray: 301.635; stroke-dashoffset: 0; fill: none; stroke-width: 13;">
    </path>
</svg>`;

const cellArray = [...document.querySelectorAll('.cell')];
const ticTacToeContainer = document.querySelector('.ticTacToe');
const resultDiv = document.querySelector('.result');
const winner = document.querySelector('.winner');
const resetBtn = document.getElementById('reset-btn');

const winCase = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 4, 8], [2, 4, 6],
    [0, 3, 6], [1, 4, 7], [2, 5, 8]
];

function setSVGsize(selector) {
    const svgElement = winner.querySelector(selector);
    if (svgElement) {
        svgElement.setAttribute('width', "180");
        svgElement.setAttribute('height', "180");
    }
}

function toggleGameVisibility(showResult) {
    ticTacToeContainer.classList.toggle('hide', showResult);
    resultDiv.classList.toggle('show', showResult);
}

function determineWinner(){
    const board = cellArray.map(cell => {
        const svg = cell.querySelector('svg'); 
        return svg ? svg.dataset.ariaLabel : ''; 
    }); 
    for(const [a, b, c] of winCase){
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            setTimeout(displayResult,500,board[a]);
            return; 
        }
    }; 
    if(board.every(cell => cell !== "")){
        setTimeout(displayResult,500,"tie"); 
    }
}

function displayResult(result) {
    if (result === "tie") {
        winner.innerHTML = `${svgX}${svgO}`;
        setSVGsize('.svg-x');
        setSVGsize('.svg-o');
        resultDiv.querySelector('.result-text').textContent = "Draw!";
    } else {
        const svgMarkup = result === "X" ? svgX : svgO;
        const svgClass = result === "X" ? '.svg-x' : '.svg-o';
        winner.innerHTML = svgMarkup;
        setSVGsize(svgClass);
        resultDiv.querySelector('.result-text').textContent = "Winner!";
    }
    setTimeout(() => toggleGameVisibility(true), 500);
}

function checkWinner(board) {
    for (const [a, b, c] of winCase) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.every(cell => cell !== "") ? "tie" : null;
}

function minimax(board, isMaximizing) {
    const result = checkWinner(board);
    if (result === "X") return -10;
    if (result === "O") return 10;
    if (result === "tie") return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "O";
                bestScore = Math.max(bestScore, minimax(board, false));
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "X";
                bestScore = Math.min(bestScore, minimax(board, true));
                board[i] = "";
            }
        }
        return bestScore;
    }
}

function findBestMove() {
    const board = cellArray.map(cell => cell.querySelector('svg')?.dataset.ariaLabel || "");
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = "O";
            let score = minimax(board, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}


function handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell || cell.innerHTML.trim()) return;
    
    cell.innerHTML = svgX;
    tracker++;
    
    if (checkWinner(cellArray.map(cell => cell.querySelector('svg')?.dataset.ariaLabel || ""))) {
        determineWinner();
        return;
    }
    
    setTimeout(() => {
        const aiMove = findBestMove();
        if (aiMove !== undefined) {
            cellArray[aiMove].innerHTML = svgO;
            tracker++;
            determineWinner();
        }
    }, 1000);
}


function resetGame(){
   toggleGameVisibility(false); 
   cellArray.forEach((cell) => cell.innerHTML = ""); 
}
document.querySelector('.ticTacToe').addEventListener('click', handleCellClick);
resetBtn.addEventListener('click', resetGame);
