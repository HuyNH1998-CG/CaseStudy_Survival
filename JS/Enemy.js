class enemy {
    speed = 3
    health = 1
    radius = 100

    constructor(player) {
        this.x = random(-this.radius, canvas.width + this.radius);
        this.y = random(-this.radius, canvas.height + this.radius)
        this.rotate(player)
        this.img = new Image()
        this.img.src = "./Images/Rat.png"
        this.angle = 0
        this.sound = new Audio("./Sound/ratdie.mp3")


    }

    rotate(player) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        this.angle = Math.atan2(dy, dx)

    }

    update(player, enemies) {
        if (this.health <= 0) {
            enemies.splice(enemies.indexOf(this), 1)
            score++
            this.sound.play()
            return
        }
        this.rotate(player)
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
    }

    render(ctx,) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle);
        ctx.translate(-this.x, -this.y)
        ctx.beginPath()
        // ctx.fillStyle = "#000000"
        ctx.drawImage(this.img, this.x - 50, this.y - 50, 100, 100,)
        // ctx.rect(this.x-25, this.y-25, 50, 50,)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}
