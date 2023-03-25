window.onload = () => {
    const CELL_SIZE = 40
    const HEALTH_CELL = CELL_SIZE / 10 - 1

    class Game {
        gameField = []
        emptyCells = new Set()
        stackCells = {}
        enemies = {}
        characterPos = []
        characterHP = 10
        swordSteps = 0
        gameEnded = false

        constructor() {
            this.field = document.getElementsByClassName("field").item(0)
            this.field.innerHTML = ``
            this.width = Math.floor(this.field.offsetWidth / CELL_SIZE)
            this.height = Math.floor(this.field.offsetHeight / CELL_SIZE)
            this.generateGameField()
            this.generateRooms()
            this.generateRoads()
            this.generateSwords()
            this.generateHealth()
            this.generateEnemies()
            this.generateCharacter()
        }

        generateGameField() {
            for (let i = 0; i < this.height; i++) {
                let line = []
                for (let j = 0; j < this.width; j++) {
                    line.push(1)
                    this.field.innerHTML +=
                        `<div id='${i}_${j}' class='tile tileW' style='left: ${CELL_SIZE * j}px; top: ${CELL_SIZE * i}px'></div>`
                }
                this.gameField.push(line)
            }
        }

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        generateRooms() {
            for (let o = 0; o < this.getRandomInt(5, 11); o++) {
                let randomWidth = this.getRandomInt(0, this.width)
                let randomHeight = this.getRandomInt(0, this.height)
                let incWidth = Math.min(this.getRandomInt(3, 9), this.width - randomWidth)
                let incHeight = Math.min(this.getRandomInt(3, 9), this.height - randomHeight)
                for (let i = randomHeight; i < randomHeight + incHeight; i++) {
                    for (let j = randomWidth; j < randomWidth + incWidth; j++) {
                        this.gameField[i][j] = 0;
                        this.emptyCells.add([i, j])
                        document.getElementById(`${i}_${j}`).className = 'tile'

                    }
                }
            }
        }

        generateRoads() {
            let [rows, cols] = [new Set(), new Set()]
            while (rows.size < this.getRandomInt(3, 6)) {
                let r = this.getRandomInt(0, this.height)
                for (let i = 0; i < this.width; i++) {
                    this.gameField[r][i] = 0;
                    this.emptyCells.add([r, i])
                    document.getElementById(`${r}_${i}`).className = 'tile'
                }
                rows.add(r)
            }
            while (cols.size < this.getRandomInt(3, 6)) {
                let c = this.getRandomInt(0, this.width)
                for (let i = 0; i < this.height; i++) {
                    this.gameField[i][c] = 0;
                    this.emptyCells.add([i, c])
                    document.getElementById(`${i}_${c}`).className = 'tile'
                }
                cols.add(c)
            }
        }

        generateSwords() {
            let emptyArr = Array.from(this.emptyCells)
            let swords = new Set()
            while (swords.size < 2) {
                let sword = emptyArr[this.getRandomInt(0, emptyArr.length)]
                let [x, y] = sword
                this.gameField[x][y] = 2
                this.emptyCells.delete(sword)
                document.getElementById(`${x}_${y}`).className = 'tile tileSW'
                swords.add(sword)
            }
        }

        generateHealth() {
            let emptyArr = Array.from(this.emptyCells)
            let healths = new Set()
            while (healths.size < 10) {
                let health = emptyArr[this.getRandomInt(0, emptyArr.length)]
                let [x, y] = health
                this.gameField[x][y] = 3
                this.emptyCells.delete(health)
                document.getElementById(`${x}_${y}`).className = 'tile tileHP'
                healths.add(health)
            }
        }

        generateEnemies() {
            let emptyArr = Array.from(this.emptyCells)
            let enemies = new Set()
            while (enemies.size < 10) {
                let enemy = emptyArr[this.getRandomInt(0, emptyArr.length)]
                let [x, y] = enemy
                this.gameField[x][y] = 4
                this.emptyCells.delete(enemy)
                this.enemies[`${x}_${y}`] = 10
                let cell = document.getElementById(`${x}_${y}`)
                cell.className = 'tile tileE'
                cell.innerHTML = `<div class='health' style='width: ${HEALTH_CELL * 10}px'>`
                enemies.add(enemy)
            }
        }

        generateCharacter() {
            let emptyArr = Array.from(this.emptyCells)
            let character = emptyArr[this.getRandomInt(0, emptyArr.length)]
            let [x, y] = character
            this.characterPos = character
            this.gameField[x][y] = 5
            this.emptyCells.delete(character)
            let cell = document.getElementById(`${x}_${y}`)
            cell.className = 'tile tileP'
            cell.innerHTML = `<div class='health' style='width: ${HEALTH_CELL * 10}px'>`
        }

        attackAllEnemies() {
            for (let i = -1; i < 2; i++) {
                let y = this.characterPos[1] + i
                if (y < 0 || y >= this.width) {
                    continue;
                }
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    let x = this.characterPos[0] + j
                    if (x < 0 || x >= this.height) {
                        continue;
                    }
                    if (this.gameField[x][y] === 4) {
                        this.enemies[`${x}_${y}`] -= this.swordSteps > 0 ? 5 : 1
                        this.swordSteps -= 1;
                        document.getElementById(`${x}_${y}`).innerHTML = `<div class='health' style='width: ${HEALTH_CELL * this.enemies[`${x}_${y}`]}px'>`
                        if (this.enemies[`${x}_${y}`] < 1) {
                            delete this.enemies[`${x}_${y}`]
                            if (Object.keys(this.enemies).length === 0) {
                                this.gameEnded = true
                                setTimeout(() => alert("Вы выиграли!"))
                                return;
                            }
                            this.gameField[x][y] = 0
                            document.getElementById(`${x}_${y}`).className = 'tile'
                        }
                    }
                }
            }
        }

        attackCharacter(enemyPos) {
            if (Math.abs(enemyPos[0] - this.characterPos[0]) < 2 && Math.abs(enemyPos[1] - this.characterPos[1]) < 2) {
                this.characterHP -= 1
                document.getElementById(`${this.characterPos[0]}_${this.characterPos[1]}`).innerHTML = `<div class='health' style='width: ${HEALTH_CELL * this.characterHP}px'>`
                if (this.characterHP < 1) {
                    document.getElementById(`${this.characterPos[0]}_${this.characterPos[1]}`).className = 'tile'
                    this.gameEnded = true
                    setTimeout(() => alert("Вы проиграли!"))
                    return;
                }
                return true
            }
            return false;

        }

        movePerson(key, position, enemy) {
            const bannedCells = [1, 4, 5]
            let newCell, oldCell, gameFieldPos1, gameFieldPos2;
            let incrementer = [0, 0]
            switch (key.toLowerCase()) {
                case "1":
                case "arrowup":
                case "ц":
                case "w" :
                    if (position[0] !== 0 && !bannedCells.includes(this.gameField[position[0] - 1][position[1]])) {
                        incrementer = [-1, 0]
                        break
                    }
                    return [-1, -1]
                case "2":
                case "arrowdown":
                case "ы":
                case "s":
                    if (position[0] !== this.height - 1 && !bannedCells.includes(this.gameField[position[0] + 1][position[1]])) {
                        incrementer = [1, 0]
                        break
                    }
                    return [-1, -1]
                case "3":
                case "arrowleft":
                case "ф":
                case "a":
                    if (position[1] !== 0 && !bannedCells.includes(this.gameField[position[0]][position[1] - 1])) {
                        incrementer = [0, -1]
                        break
                    }
                    return [-1, -1]
                case "4":
                case "arrowright":
                case "в":
                case "d":
                    if (position[1] !== this.width - 1 && !bannedCells.includes(this.gameField[position[0]][position[1] + 1])) {
                        incrementer = [0, 1]
                        break
                    }
                    return [-1, -1]
                default:
                    return [-1, -1]
            }
            gameFieldPos1 = position[0] + incrementer[0]
            gameFieldPos2 = position[1] + incrementer[1]
            newCell = document.getElementById(`${gameFieldPos1}_${gameFieldPos2}`)
            oldCell = document.getElementById(`${position[0]}_${position[1]}`)
            newCell.className = enemy ? 'tile tileE' : 'tile tileP'
            oldCell.className = 'tile'
            newCell.innerHTML = oldCell.innerHTML
            oldCell.innerHTML = ``
            this.gameField[position[0]][position[1]] = 0

            if (this.stackCells[`${position[0]}_${position[1]}`]) {
                oldCell.className = this.stackCells[`${position[0]}_${position[1]}`] === 2 ? 'tile tileSW' : 'tile tileHP'
                this.gameField[position[0]][position[1]] = this.stackCells[`${position[0]}_${position[1]}`]
                delete this.stackCells[`${position[0]}_${position[1]}`]
            }

            if (this.gameField[gameFieldPos1][gameFieldPos2] === 2) {
                if (enemy) {
                    this.stackCells[`${gameFieldPos1}_${gameFieldPos2}`] = 2
                } else {
                    this.swordSteps = 3
                    this.gameField[gameFieldPos1][gameFieldPos2] = 5
                }
            }
            if (this.gameField[gameFieldPos1][gameFieldPos2] === 3) {
                if (enemy) {
                    this.stackCells[`${gameFieldPos1}_${gameFieldPos2}`] = 3
                } else {
                    this.characterHP = 10
                    newCell.innerHTML = `<div class='health' style='width: ${HEALTH_CELL * 10}px'>`
                    this.gameField[gameFieldPos1][gameFieldPos2] = 5
                }
            }

            this.gameField[gameFieldPos1][gameFieldPos2] = enemy ? 4 : 5

            return [gameFieldPos1, gameFieldPos2]
        }

        moveEnemies() {
            for (let k in this.enemies) {
                let positionInt = k.split('_')
                positionInt.forEach((v, i, a) => {
                    a[i] = parseInt(v)
                })
                if (this.attackCharacter(positionInt)) {
                    continue
                }
                let action = this.getRandomInt(1, 5)

                let newPos = this.movePerson(`${action}`, positionInt, true)
                if (JSON.stringify(newPos) === JSON.stringify([-1, -1])) {
                    continue
                }
                let value = this.enemies[k]
                delete this.enemies[k]
                this.enemies[`${newPos[0]}_${newPos[1]}`] = value
            }
        }

        move(key) {
            if (this.gameEnded) {
                return;
            }
            if (key === ' ') {
                this.attackAllEnemies()
                this.moveEnemies()
                return;
            }
            let newPos = this.movePerson(key, this.characterPos, false)
            if (JSON.stringify(newPos) === JSON.stringify([-1, -1])) {
                return;
            }
            if (JSON.stringify(newPos) === JSON.stringify(this.characterPos)) {
                alert("Вы не можете пойти сюда")
                return;
            }
            this.characterPos = newPos
            this.moveEnemies()
        }

    }

    let game = new Game()
    addEventListener("keydown", (e) => game.move(e.key))
}