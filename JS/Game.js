let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d")
let players = new Player(500, 350)
let weapons = []
let enemies = []
let keyMap = []
let fps = 60;
let frame = 0;
let interval, start, now, then, elapsed, update, reqAnimate
let numberOfHighScores = 10;
let HighScores = 'highScores'
let score = 0
let highScoreString = localStorage.getItem(HighScores);
let highScores = JSON.parse(highScoreString) ?? [];
let timer = 10
let winSound = new Audio("./Sound/Won.mp3")
let spawner;
let timeCounter;

function checkHighScore(scores) {
    let highScores = JSON.parse(localStorage.getItem(HighScores)) ?? [];
    let lowestScore = highScores[numberOfHighScores - 1]?.score ?? 0;
    if (scores > lowestScore) {
        saveHighScore(scores, highScores);
        showHighScores()
        score = 0
        document.getElementById("playAgain").style.display = "inline";
        document.getElementById("continue").style.display = "none"
    }
    return score
}

function saveHighScore(score, highScores) {
    let name = prompt();
    let newScore = {score, name}
    highScores.push(newScore)
    highScores.sort((a, b) => b.score - a.score)
    highScores.splice(numberOfHighScores)
    localStorage.setItem(HighScores, JSON.stringify(highScores))
}

function showHighScores() {
    let highScores = JSON.parse(localStorage.getItem(HighScores)) ?? [];
    let highScoreList = document.getElementById(HighScores);

    highScoreList.innerHTML = highScores
        .map((score) => `<li>${score.score} - ${score.name}`)
        .join('')
}


function random(min, max) {
    return (Math.random() * (max - min)) + min
}

const distance = (x1, y1, x2, y2) => {
    let xx = Math.pow((x2 - x1), 2),
        yy = Math.pow((y2 - y1), 2);
    return Math.sqrt(xx + yy)
}

window.addEventListener("keydown", event => {
    let {key} = event
    if (!keyMap.includes(key)) {
        keyMap.push(key)
    }
})

window.addEventListener("keyup", event => {
    let {key} = event
    if (keyMap.includes(key)) {
        keyMap.splice(keyMap.indexOf(key), 1)
    }
})

let keyPressed = function (key) {
    return keyMap.includes(key)
}

function startAnimation() {
    interval = 1000 / fps
    then = Date.now();
    start = then
    loop()
}

function loop() {
    reqAnimate = window.requestAnimationFrame(loop)

    now = Date.now();
    elapsed = now - then

    if (elapsed > interval) {
        then = now - (elapsed % interval)
        update(frame++ % (Number.MAX_SAFE_INTEGER - 1))
    }
}

function animation(loop) {
    spawner = setInterval(spawn, 1000)
    timeCounter = setInterval(timerDecrease, 1000)
    update = loop;
    startAnimation()
}


function pointer(canvas, event) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    return {x, y}
}

function active() {
    document.getElementById("Start").style.display = "none"
    document.getElementById("continue").style.display = "none"
    document.getElementById("playAgain").style.display = "none"
    document.getElementById("scorer").style.display = "none";

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ac561c"
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    ctx.closePath()

    if (players.isAlive() === true) {
        weapons.forEach(weapon => {
            weapon.render(ctx)
            weapon.update(weapons, enemies, players)
        })

        enemies.forEach(enemy => {
            enemy.update(players, enemies)
            enemy.render(ctx)
        })

        players.update(enemies)
        players.render(ctx)
    }

    display()

    if (players.isAlive() === false) {
        clearInterval(spawner)
        clearInterval(timeCounter)
        GameOver()
    } else if (timer === 0) {
        clearInterval(spawner)
        clearInterval(timeCounter)
        Victory()
    }
}

function display() {
    document.getElementById("score").innerHTML = `Score is: ${score}`
    document.getElementById("health").innerHTML = `Health ${players.health}`
    document.getElementById("time").innerHTML = `Time left: ${timer}`
}

function spawn() {
    enemies.push(new enemy(players))
    enemies.push(new enemy(players))
    enemies.push(new enemy(players))
}

document.body.addEventListener("click", () => {
    weapons.push(new weapon(players.x, players.y, players.angle))
})
document.body.addEventListener("mousemove", (event) => {
    let mouse = pointer(canvas, event)
    players.rotate(mouse)
})

function welcome() {
    document.getElementById("Start").style.display = "none"
    document.getElementById("Next3").style.display = "none";
    document.getElementById("Next2").style.display = "none";
    document.getElementById("scorer").style.display = "none";
    document.getElementById("highScoresList").style.display = "none";
    document.getElementById("continue").style.display = "none"
    document.getElementById("playAgain").style.display = "none"
    ctx.beginPath()
    ctx.font = "50px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Welcome to the rat cave", canvas.width / 2, canvas.height / 4)
    ctx.closePath()
}

function next1() {
    document.getElementById("Next").style.display = "none"
    document.getElementById("Next2").style.display = "inline"
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = "40px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`You are a peasant who do no harm to others.`, canvas.width / 2, 100)
    ctx.fillText(`But one day, you passed out while working.`, canvas.width / 2, 200)
    ctx.fillText(`Turn out, it was the evil Wizard,`, canvas.width / 2, 300)
    ctx.fillText(`He has choose you to be his amusement`, canvas.width / 2, 400)
    ctx.fillText(` and as food for his rats...`, canvas.width / 2, 500)
}

function next2() {
    document.getElementById("Next2").style.display = "none"
    document.getElementById("Next3").style.display = "inline";
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = "40px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`He promised to let you out if he is amused.`, canvas.width / 2, 100)
    ctx.fillText(`But we all know how evil people work...`, canvas.width / 2, 200)
    ctx.fillText(`So try to smash as many of his rat before you died`, canvas.width / 2, 300)
    ctx.fillText(`Use WASD to move around`, canvas.width / 2, 500)
    ctx.fillText(`Click to throw bats at the rat`, canvas.width / 2, 600)
    ctx.closePath()
}

function next3() {
    document.getElementById("Next3").style.display = "none";
    document.getElementById("Start").style.display = "inline";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    ctx.font = "60px Arial"
    ctx.fillStyle = "#FF0000"
    ctx.textAlign = "center"
    ctx.fillText(`Don't let the rat to stack up too much`, canvas.width / 2, canvas.height - 400)
    ctx.fillText(`or you will get snowball effect`, canvas.width / 2, canvas.height - 300)
}

function GameOver() {
    window.cancelAnimationFrame(reqAnimate)
    players.dieSound.play()
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "100px Arial";
    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    ctx.fillText("You Died", canvas.width / 2, 250)
    ctx.font = " 40px Arial"
    ctx.fillText("If your score is higher than the one is the list", canvas.width / 2, 300)
    ctx.fillText("Press High Score to record it", canvas.width / 2, 400)
    ctx.fillText('Was your effort worth it?', canvas.width / 2, 500)
    showHighScores(score)
    document.getElementById("scorer").style.display = "inline";
    document.getElementById("highScoresList").style.display = "inline";
    document.getElementById("playAgain").style.display = "inline";
    document.getElementById("scorer").style.display = "inline";
}

function Victory() {
    window.cancelAnimationFrame(reqAnimate)
    winSound.play()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.font = "50px Arial";
    ctx.fillStyle = "#FFD700"
    ctx.textAlign = "center"
    ctx.fillText(`Impressed, you survived 1 minute`, canvas.width / 2, 100)
    ctx.fillText(`The Wizard said`, canvas.width / 2, 200)
    ctx.fillText(`Now I have to let you out don't I`, canvas.width / 2, 300)
    ctx.fillText(`But no matter, you will never escape from me`, canvas.width / 2, 400)
    ctx.fillText("If your score is higher than the one is the list", canvas.width / 2, 500)
    ctx.fillText("Press High Score to record it", canvas.width / 2, 600)
    showHighScores(score)
    document.getElementById("scorer").style.display = "inline";
    document.getElementById("highScoresList").style.display = "inline"
    document.getElementById("continue").style.display = "inline"
    document.getElementById("scorer").style.display = "inline";
}

function timerDecrease() {
    timer--
    return timer
}

function reset() {
    enemies = []
    timer = 10
    players.x = 500
    players.y = 500
    document.getElementById("continue").style.display = "none"
    animation(active)
}

function playAgain() {
    enemies = []
    score = 0
    players.health = 50
    players.alive = true
    timer = 10
    players.x = 500
    players.y = 500
    document.getElementById("playAgain").style.display = "none"
    animation(active)
}

welcome()



