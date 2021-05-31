class Player {
    health = 50;
    alive = true;
    hurtSound = new Audio("./Sound/Hurt.wav")
    dieSound = new Audio("./Sound/Die.wav")

    constructor(x, y) {
        this.health = 50;
        this.speed = 6;
        this.x = x;
        this.y = y;
        this.angle = -Math.PI / 2;
        this.radius = 25;
        this.img = new Image()
        this.img.src = "./Images/Human.png"

    }

    isAlive() {
        if (this.health > 0) {
            this.alive = true
        } else {
            this.alive = false
        }
        return this.alive
    }

    rotate({x, y}) {
        let dy = y - this.y;
        let dx = x - this.x;
        this.angle = Math.atan2(dy, dx)
        return this.angle
    }

    collide(enemies) {
        for (const enemy of enemies) {
            let dist = distance(enemy.x, enemy.y, this.x, this.y)
            if (dist <= enemy.radius / 2) {
                this.health--

                enemies = enemies.splice(enemies.indexOf(enemy), 1)
                this.hurtSound.play()
            }
        }
    }

    render(ctx) {
        ctx.save()


        ctx.translate(this.x, this.y)
        ctx.rotate(Math.PI * 2)
        ctx.rotate(this.angle);
        ctx.translate(-this.x, -this.y)
        ctx.beginPath()
        ctx.drawImage(this.img, this.x - 25, this.y - 25, 50, 50)
        ctx.fill();
        ctx.closePath()
        ctx.restore()

    }

    move() {
        if (keyPressed("w") && this.y - this.speed - this.radius > 0) {
            this.y -= this.speed
        }
        if (keyPressed("s") && this.y + this.speed + this.radius < canvas.height) {
            this.y += this.speed
        }
        if (keyPressed("a") && this.x - this.speed - this.radius > 0) {
            this.x -= this.speed
        }
        if (keyPressed("d") && this.x + this.speed + this.radius < canvas.width) {
            this.x += this.speed
        }
    }

    update(enemies) {
        if (this.isAlive() === true) {
            this.move()
            this.collide(enemies)

        }
    }
}