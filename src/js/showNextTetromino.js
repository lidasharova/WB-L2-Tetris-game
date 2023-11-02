export const showNextTetromino = (name) => {
  const block = document.querySelector('.tetromino');

  switch (name) {
    case 'I':
      block.className = 'tetromino tetromino-i';
      break;
    case 'Z':
      block.className = 'tetromino tetromino-z';
      break;
    case 'S':
      block.className = 'tetromino tetromino-s';
      break;
    case 'T':
      block.className = 'tetromino tetromino-t';
      break;
    case 'O':
      block.className = 'tetromino tetromino-o';
      break;
    case 'L':
      block.className = 'tetromino tetromino-l';
      break;
    case 'J':
      block.className = 'tetromino tetromino-j';
      break;
  }
};
