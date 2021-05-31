
class weapon {
    radius = 5;

    constructor(x, y, angle) {
        this.angle = {
            x: Math.cos(angle),
            y: Math.sin(angle)

        }
        this.img = new Image()
        this.img.src = `./Images/bat.png`
        this.x = x + this.angle.x * 40;
        this.y = y + this.angle.y * 40;
        this.sound = new Audio("./Sound/BatHit.wav")
    }

    boundary(player) {
        if (
            this.x < player.x - 40 ||
            this.y < player.y - 40 ||
            this.x > player.x + 40 ||
            this.y > player.y + 40){
            return true
        }
    }

    update(weapons, enemies,player) {
        this.sound.play()
        if (this.boundary(player) === true) {
            weapons.splice(weapons.indexOf(this), 1)
            return
        }

        for (let weapon of weapons) {
            for (let enemy of enemies) {
                let dist = distance(enemy.x, enemy.y, this.x, this.y)
                if (dist <= enemy.radius/2) {
                    weapons = weapons.splice(weapons.indexOf(this), 1)
                    enemy.health--;

                    return
                }
            }
        }
        this.x += this.angle.x
        this.y += this.angle.y
    }

    render(ctx) {

        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.drawImage(this.img,this.x-20,this.y-20,40,40)
        // ctx.rect(this.x-20, this.y-20, 40, 40)
        ctx.fill();
        ctx.closePath()
    }
}