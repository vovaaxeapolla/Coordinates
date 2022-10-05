const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
let width = canvas.width = document.documentElement.clientWidth,
    height = canvas.height = document.documentElement.clientHeight,
    particles = [],
    coordinates = {
        x: width / 2,
        y: height / 2,
        axisX: { x: 1, y: 0 },
        axisY: { x: 0, y: -1 },
        scale: 2,
        innerX: 0,
        innerY: 0,
    },
    mouseCoordinates = {
        x: null,
        y: null
    },
    isMouseDown = false;

// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

document.addEventListener('mousedown', e => {
    mouseCoordinates = {x: e.clientX, y: e.clientY};
    isMouseDown = true;
})
document.addEventListener('mousemove', e => {
    mouseCoordinates = {x: e.clientX, y: e.clientY};
})
document.addEventListener('mouseup', () => {
    isMouseDown = false;
})
document.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowRight":
            coordinates.x += 1;
            break;
        case "ArrowUp":
            coordinates.y += 1;
            break;
        case "ArrowLeft":
            coordinates.x -= 1;
            break;
        case "ArrowDown":
            coordinates.y -= 1;
            break;
        case "w":
            if(isMouseDown){
                coordinates.innerX = mouseCoordinates.x -coordinates.x;
                coordinates.innerY = mouseCoordinates.y - coordinates.y;
            }
            coordinates.scale += 0.1;
            break;
        case "s":
            if (coordinates.scale - 0.1 < 0) coordinates.scale = 0.01;
            else coordinates.scale -= 0.1;
            break;
        case "d":
            rotate(Math.radians(1));
            break;
        case "a":
            rotate(Math.radians(-1));
            break;
        case "Enter":
            console.log(coordinates);
            break;
        default:
            break;
    }
});

document.body.append(canvas);

function rotate(rad) {
    let x = coordinates.axisX.x * Math.cos(rad) - coordinates.axisX.y * Math.sin(rad);
    let y = coordinates.axisX.x * Math.sin(rad) + coordinates.axisX.y * Math.cos(rad);
    coordinates.axisX.x = x;
    coordinates.axisX.y = y;
    x = coordinates.axisY.x * Math.cos(rad) - coordinates.axisY.y * Math.sin(rad);
    y = coordinates.axisY.x * Math.sin(rad) + coordinates.axisY.y * Math.cos(rad);
    coordinates.axisY.x = x;
    coordinates.axisY.y = y;
}

class Particle {
    constructor(x, y, velocityX, velocityY, accelerationX, accelerationY, mass, radius, color, smooth, sphere, maxVelocity, maxAcceleartion, minVelocity, minAcceleartion) {
        this.x = x || 0;
        this.y = y || 0;
        this.velocityX = velocityX || 0;
        this.velocityY = velocityY || 0;
        this.accelerationX = accelerationX || 0;
        this.accelerationY = accelerationY || 0;
        this.mass = mass || 0.05;
        this.radius = radius || 1;
        this.color = color || "#FFF";
        this.smooth = smooth || 1;
        this.sphere = sphere || 300
        this.maxVelocity = maxVelocity || 5
        this.maxAcceleartion = maxAcceleartion || 2
        this.minVelocity = minVelocity || 0
        this.minAcceleartion = minAcceleartion || 0
    }

    collision(OtherParticle) {
        if ((this.radius + OtherParticle.radius) * (this.radius + OtherParticle.radius) <
            (this.x - OtherParticle.x) *
            (this.x - OtherParticle.x) +
            (this.y - OtherParticle.y) *
            (this.y - OtherParticle.y)
        ) return true;
        return false;
    }

    calcGravity(OtherParticle) {
        let dx = OtherParticle.x - this.x,
            dy = OtherParticle.y - this.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            f = (dist - this.sphere) / dist * OtherParticle.mass || 1;
        this.accelerationX += dx * f * this.mass;
        this.accelerationY += dy * f * this.mass;
    }

    move() {
        if (Math.abs(this.velocityX) > this.maxVelocity && this.velocityX > 0) this.velocityX = this.maxVelocity;
        if (Math.abs(this.velocityX) > this.maxVelocity && this.velocityX < 0) this.velocityX = -this.maxVelocity;
        if (Math.abs(this.velocityY) > this.maxVelocity && this.velocityY > 0) this.velocityY = this.maxVelocity;
        if (Math.abs(this.velocityY) > this.maxVelocity && this.velocityY < 0) this.velocityY = -this.maxVelocity;
        this.velocityX *= this.smooth;
        this.velocityY *= this.smooth;
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
};

window.addEventListener('resize', () => {
    width = canvas.width = document.documentElement.clientWidth;
    height = canvas.height = document.documentElement.clientHeight;
});

//Очищаем канвас
function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
}

function update() {

}

function draw() {
    ctx.fillStyle = '#45AA54';
    for (let i of particles) {
        ctx.beginPath();
        ctx.arc(
            (i.x * coordinates.axisX.x + i.y * coordinates.axisY.x+coordinates.innerX) * coordinates.scale + coordinates.x,
            (i.y * coordinates.axisY.y + i.x * coordinates.axisX.y+coordinates.innerY) * coordinates.scale + coordinates.y,
            i.radius * coordinates.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    ctx.fillStyle = '#F00';
    ctx.beginPath();
    ctx.arc(
        0 + coordinates.x,
        0 + coordinates.y,
        5 * coordinates.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = '#F00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);
    ctx.lineTo((100 * coordinates.axisX.x) * coordinates.scale + coordinates.x, (100 * coordinates.axisX.y) * coordinates.scale + coordinates.y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y);
    ctx.lineTo((100 * coordinates.axisY.x) * coordinates.scale + coordinates.x, (100 * coordinates.axisY.y) * coordinates.scale + coordinates.y);
    ctx.stroke();
    ctx.closePath();

}
function render() {
    clear();
    update();
    draw()
    requestAnimationFrame(render);
}

function init() {
    for (let i = 0; i < 100; i++) {
        particles.push(
            new Particle(
                Math.random() * width - width / 2,
                Math.random() * height - height / 2,
                null,
                null,
                null,
                null,
                Math.random() * 0.1,
                Math.random() * 5,
                null,
                0.9,
                300,
                5,
                Math.random()
            ));
    }
    render();
};
init();