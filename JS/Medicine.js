class medicine {
    radius = 50

    constructor() {
        this.x = random(100, canvas.width - 100);
        this.y = random(100, canvas.height - 100);
        this.img = new Image()
        this.img.src = "./Images/MedicKit.png"
    }

    render(ctx) {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.drawImage(this.img, this.x - 25, this.y - 25, 50, 50)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update(player) {
        let dist = distance(player.x, player.y, this.x, this.y)
        if (dist <= player.radius) {
            player.health = player.health + 5
            medicines.splice(medicines.indexOf(this), 1)
        }

    }
}