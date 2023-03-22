const CELL_SIZE = 40
const HEALTH_CELL = CELL_SIZE / 10 - 1

class Game {
    gameField = []
    emptyCells = new Set()

    enemies = {}
    characterPos = []
    characterHP = 10

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
            console.log(randomWidth, randomHeight, incWidth)
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
        while(cols.size < this.getRandomInt(3, 6)) {
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
            cell.innerHTML = `<div class='health' style='width: ${HEALTH_CELL*10}px'>`
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
        cell.innerHTML = `<div class='health' style='width: ${HEALTH_CELL*10}px'>`
    }

    move(key) {

    }

}

window.onload = () => {
    let game = new Game()
    addEventListener("keydown", (e) => game.move(e.key))
}