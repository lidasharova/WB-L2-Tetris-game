// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
  // проверяем все строки и столбцы
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // если выходит за границы поля…
        (cellCol + col < 0 ||
          cellCol + col >= gameField[0].length ||
          cellRow + row >= gameField.length ||
          // …или пересекается с другими фигурами
          gameField[cellRow + row][cellCol + col])
      ) {
        // то возвращаем, что нет, так не пойдёт
        return false;
      }
    }
  }
  // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
  return true;
}
