import { getRandomNumber } from './getRandomNumber.js';
import { showNextTetromino } from './showNextTetromino.js';

const restartButton = document.querySelector('.restart');
const startButton = document.querySelector('.start');
const scoreCountEl = document.querySelector('.score-total');
const gameOverPopup = document.querySelector('.popup');
const pauseButton = document.querySelector('.pause');

let score = 0;
let isPaused = false;
let isGameActive = false;

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 25;
let tetrominoSequence = [];

// заполняем игровой массив пустыми ячейками
let gameField = [];
for (let row = -2; row < 20; row++) {
  gameField[row] = [];

  for (let col = 0; col < 10; col++) {
    gameField[row][col] = 0;
  }
}

//наши фигуры
const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

//подбираем цвет каждой фигуры
const colors = {
  I: 'cyan',
  O: 'yellow',
  T: 'rgb(211, 86, 211)',
  S: 'green',
  Z: 'rgb(242, 82, 54)',
  J: '#13abe7',
  L: 'orange',
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;

// создаём массив фигур, которые появится в игре
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  while (sequence.length) {
    const rand = getRandomNumber(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

// получаем следующую фигуру
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }
  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];
  const col = gameField[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const row = name === 'I' ? -1 : -2;
  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col,
  };
}

// поворачиваем матрицу на 90 градусов
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
  return result;
}

// проверяем возможность нахождения фигуры в поле
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        (cellCol + col < 0 ||
          cellCol + col >= gameField[0].length ||
          cellRow + row >= gameField.length ||
          gameField[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }
  return true;
}

const placeTetromino = () => {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        gameField[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  for (let row = gameField.length - 1; row > 0; ) {
    if (gameField[row].every((cell) => !!cell)) {
      for (let r = row; r >= 0; r--) {
        for (let col = 0; col < gameField[r].length; col++) {
          gameField[r][col] = gameField[r - 1][col];
        }
      }
      //обновление счета игры
      scoreCountEl.innerHTML = score += 10;
    } else {
      row--;
    }
  }
  tetromino = getNextTetromino();
  showNextTetromino(tetrominoSequence[tetrominoSequence.length - 1]);
};

// ф-ция для показа попапа "Game Over"
function showGameOver() {
  if (isGameActive) {
    cancelAnimationFrame(rAF);
    gameOver = true;
    isGameActive = false;
    isPaused = true;
    gameOverPopup.style.display = 'block';
  }
}

// закрытие попапа
document.addEventListener('click', (event) => {
  if (event.target === gameOverPopup) {
    gameOverPopup.style.display = 'none';
  }
});

// главный цикл игры
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  // рисуем игровое поле с учётом заполненных фигур
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (gameField[row][col]) {
        const name = gameField[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  // рисуем текущую фигуру
  if (tetromino) {
    if (++count > 35) {
      tetromino.row++;
      count = 0;
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }
    context.fillStyle = colors[tetromino.name];
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          context.fillRect(
            (tetromino.col + col) * grid,
            (tetromino.row + row) * grid,
            grid - 1,
            grid - 1
          );
        }
      }
    }
  }
}

// следим за нажатиями на клавиш управления фигуркой
document.addEventListener('keydown', function (e) {
  if (gameOver) return;
  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37 ? tetromino.col - 1 : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }
  if (e.which === 38) {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }
  if (e.which === 40) {
    const row = tetromino.row + 1;
    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;
      placeTetromino();
      return;
    }
    tetromino.row = row;
  }
});

// Функция для запуска игры
function startGame() {
  if (!isGameActive) {
    isGameActive = true;
    gameOver = false;
    isPaused = false;
    gameField = [];
    for (let row = -2; row < 20; row++) {
      gameField[row] = [];
      for (let col = 0; col < 10; col++) {
        gameField[row][col] = 0;
      }
    }
    score = 0;
    showNextTetromino(tetrominoSequence[tetrominoSequence.length - 1]);
    loop();
  }
}

//ф-ция перезапуска игры если игра не закончена
function restartGame() {
  if (!gameOver) {
    cancelAnimationFrame(rAF);
  }
  score = 0;
  isPaused = false;
  tetrominoSequence = [];
  gameField = [];
  gameOver = false;
  if (pauseButton.textContent === 'CONTINUE') {
    pauseButton.textContent = 'PAUSE';
  }
  for (let row = -2; row < 20; row++) {
    gameField[row] = [];
    for (let col = 0; col < 10; col++) {
      gameField[row][col] = 0;
    }
  }
  scoreCountEl.textContent = '0';
  generateSequence();
  tetromino = getNextTetromino();
  showNextTetromino(tetrominoSequence[tetrominoSequence.length - 1]);
  rAF = requestAnimationFrame(loop);
}

// пауза
function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    cancelAnimationFrame(rAF);
  } else {
    rAF = requestAnimationFrame(loop);
  }
}
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', function () {
  togglePause();
  pauseButton.textContent = isPaused ? 'CONTINUE' : 'PAUSE';
});
restartButton.addEventListener('click', function () {
  restartGame();
});
