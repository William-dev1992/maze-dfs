const maze = document.querySelector('.maze');
const ctx = maze.getContext('2d');

let current;

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;

    this.grid = [];
    this.stack = [];
  }

  setUp() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
  }

  draw() {
    maze.width = this.size;
    maze.height = this.size;

    maze.style.background = "black";

    current.visited = true;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }

    let next = current.checkNeighbours();

    if (next) {
      next.visited = true;

      this.stack.push(current);

      current.highlight(this.columns);

      current.removeWall(current, next);

      current = next;
    } else if(this.stack.length > 0){
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }

    if(this.stack.length == 0) {
      return;
    }

    window.requestAnimationFrame(() => {
      this.draw();
    })
  }

}

class Cell {
  constructor(rowNumb, colNumb, parentGrid, parentSize) {
    this.rowNumb = rowNumb;
    this.colNumb = colNumb;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;

    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true
    };
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNumb;
    let col = this.colNumb;
    let neighbours = [];

    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  drawTopWall(xCord, yCord, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(xCord, yCord);
    ctx.lineTo(xCord + size / columns, yCord);
    ctx.stroke();
  }

  drawRightWall(xCord, yCord, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(xCord + size / columns, yCord);
    ctx.lineTo(xCord + size / columns, yCord + size / rows);
    ctx.stroke();
  }

  drawBottomWall(xCord, yCord, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(xCord, yCord + size / rows);
    ctx.lineTo(xCord + size / columns, yCord + size / rows);
    ctx.stroke();
  }

  drawLeftWall(xCord, yCord, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(xCord, yCord);
    ctx.lineTo(xCord, yCord + size / rows);
    ctx.stroke();
  }

  highlight(columns) {
    let x = (this.colNumb * this.parentSize) / columns + 1;
    let y = (this.rowNumb * this.parentSize) / columns + 1;

    ctx.fillStyle = "green";
    ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3)
  }

  removeWall(cell1, cell2) {
    let x = (cell1.colNumb - cell2.colNumb);

    if (x == 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x == -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }

    let y = (cell1.rowNumb - cell2.rowNumb);

    if (y == 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y == -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show(size, rows, columns) {
    let x = (this.colNumb * size) / columns;
    let y = (this.rowNumb * size) / rows;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);

    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}

let newMaze = new Maze(500, 20, 20);
newMaze.setUp();
newMaze.draw();