var c = document.createElement("canvas");
var ctx = c.getContext("2d");

var scale = 5;

c.width = window.innerWidth * scale;
c.height = window.innerHeight * scale;

var s = c.height/4;

keyDown = {};

var wsURL = "ws://cleverlynamedwebsite.pw:4327";

var ws = new WebSocket(wsURL);

var players = [];

ws.onmessage = (e)=>{
    if(!isNaN(e.data)){
        p.id = e.data;
    } else {
        data = JSON.parse(e.data);
        players = data.players;
        if(data.platforms != undefined){
            platforms = data.platforms;
        }
    }
}

ws.onclose = (e) => {
    p.x = NaN;
    p.y = NaN;
    ws.send(JSON.stringify(p));
}

window.onunload = (e) => {
    p.x = NaN;
    p.y = NaN;
    ws.send(JSON.stringify(p));
}

function updateSocket(){
    if(ws.CONNECTING == 0){
        ws.send(JSON.stringify(p))
    }
}

var camera = {
    xOff: -0.5,
    yOff: -0.5,
    x: -0.5,
    y: -0.5,
    followSpeed: 1,
    update: () => {
        camera.x += camera.followSpeed*((p.x + camera.xOff) - camera.x);
        camera.y += camera.followSpeed*((p.y + camera.yOff) - camera.y);
    }
}

onkeydown = (e) => {
    keyDown[e.key] = true;
}

onkeyup = (e) => {
    keyDown[e.key] = false;
}

document.body.append(c);

var p = {
    x: 0,
    y: 0.19,
    size: 0.01,
    velocity: 0,
    direction: 0,
    inAir: true,
    velocityY: 0,
    flying: false,
    groundedSinceFlight: false,
    fallDirection: 1,
    fallTimer: 0,
    trail: [],
    trailMod: 0,
    won: false,
    spawnX: 0,
    spawnY: 0.19
}

function update(){
    camera.update();
    ctx.clearRect(0, 0, c.width, s);
    drawEnemies();
    movePlayer();
    for(i of platforms){
        i.draw();
    }

    updateSocket();
}

function drawPlayer(){
    ctx.strokeStyle = "orange";
    ctx.lineWidth = s / 200;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo((p.x - camera.x) * s + ((c.width - c.height) / 2), (p.y - camera.y) * s)
    ctx.lineTo((p.x - camera.x) * s + ((c.width - c.height) / 2) + 0.02 * s * Math.cos(p.direction), (p.y - camera.y) * s + 0.02 * s * Math.sin(p.direction));
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo((p.x - camera.x) * s + ((c.width - c.height) / 2), (p.y - camera.y) * s);
    for(i of p.trail){
        ctx.lineTo((i[0] - camera.x) * s + ((c.width - c.height) / 2), (i[1] - camera.y) * s);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc((p.x - camera.x) * s + ((c.width - c.height) / 2), (p.y - camera.y) * s, p.size * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function movePlayer(){
    p.trailMod++;
    if(p.trailMod == 1){
        p.trail.unshift([p.x, p.y]);
        if(p.trail.length > 10){
            p.trail.pop();
        }
        p.trailMod = 0;
    }
    var flightThreshold = 0;
    var turnSpeed = Math.PI / 75;
    var velocityScalar = 0;
    var moveVector = [0, 0];
    if(p.velocity > flightThreshold && p.flying && p.fallTimer <= 0){
        p.groundedSinceFlight = false;
        if(keyDown["s"]){
            p.direction += turnSpeed;
        }
        if(keyDown["w"]){
            p.direction -= turnSpeed;
        }

        p.velocity += velocityScalar * (Math.sin(p.direction)- 0.15);

        if(p.velocity <= flightThreshold){
            p.fallTimer = 10;
            p.fallDirection = Math.cos(p.direction);
        }

        p.velocityY = p.velocity;

        moveVector[0] = p.velocity * Math.cos(p.direction);
        moveVector[1] = p.velocity * Math.sin(p.direction);
    } else {
        p.flying = false;
        var gravity = 0.0002;
        var moveSpeed = 0.0075;

        if(p.velocityY == 0){
            p.groundedSinceFlight = true;
        }

        if(p.velocityY == 0 && keyDown[" "]){
            p.velocityY = -0.0075;
        }

        if(keyDown["d"] && p.groundedSinceFlight){
            moveVector[0] += moveSpeed;
        }
        if(keyDown["a"] && p.groundedSinceFlight){
            moveVector[0] -= moveSpeed;
        }
        p.velocityY += gravity;

        moveVector[1] += p.velocityY;

        var animationAngle = Math.atan2(moveVector[1], moveVector[0]);

        if(p.fallTimer > 0){
            p.fallTimer--;

            while(animationAngle < p.direction){
                animationAngle += Math.PI * 2
            }
            if(p.fallDirection < 0){
                animationAngle -= Math.PI * 2;
            }

            p.direction += 1/4 * (animationAngle - p.direction);
        }else {
            p.direction = animationAngle;
        }

        p.velocity = Math.hypot(moveVector[0], moveVector[1]);

        if(keyDown["w"] && Math.hypot(moveVector[0], moveVector[1]) > flightThreshold){
            p.flying = true;
        }

        if(keyDown["s"] && Math.hypot(moveVector[0], moveVector[1]) > flightThreshold){
            p.flying = true;
        }
    }
    
    p.x += moveVector[0];
    p.y += moveVector[1];

    var plats = collidingWithPlatform(p);

    
    for(plat of plats){
        var center = [plat.x + plat.w / 2, plat.y + plat.h / 2];
        var topRight = [plat.x + plat.w, plat.y];
        var topLeft = [plat.x, plat.y];
        var bottomRight = [plat.x + plat.w, plat.y + plat.h];
        var bottomLeft = [plat.x, plat.y + plat.h];

        var pAngle = Math.atan2(p.y - center[1], p.x - center[0]);

        var topRightAngle = Math.atan2(topRight[1] - center[1], topRight[0] - center[0]);
        var topLeftAngle = Math.atan2(topLeft[1] - center[1], topLeft[0] - center[0]);
        var bottomLeftAngle = Math.atan2(bottomLeft[1] - center[1], bottomLeft[0] - center[0]);
        var bottomRightAngle = Math.atan2(bottomRight[1] - center[1], bottomRight[0] - center[0]);
        


        if(pAngle > topLeftAngle && pAngle < topRightAngle){
            p.velocity = 0;
            p.velocityY = 0;
            p.y = plat.y - p.size;
        }
        if(pAngle < Math.PI && pAngle > bottomLeftAngle){
            pAngle -= Math.PI * 2;
        }
        if(pAngle > bottomLeftAngle - Math.PI * 2 && pAngle < topLeftAngle){
            p.x = plat.x - p.size;
        }
        if(pAngle > bottomRightAngle && pAngle < bottomLeftAngle){
            p.y = plat.y + plat.h + p.size;
            if(p.velocityY > 0){
                p.velocityY = -0.0001;
            }
        }
        if(pAngle > topRightAngle && pAngle < bottomRightAngle){
            p.x = plat.x + plat.w + p.size;
        }

        plat.action();
    }

    drawPlayer();
}

function drawEnemies(){
    for(i of players){

        if(i != null){

            if(i.id != p.id && i.x != null){
                ctx.strokeStyle = "red";
                ctx.lineWidth = s / 200;
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo((i.x - camera.x) * s + ((c.width - c.height) / 2), (i.y - camera.y) * s)
                ctx.lineTo((i.x - camera.x) * s + ((c.width - c.height) / 2) + 0.02 * s * Math.cos(i.direction), (i.y - camera.y) * s + 0.02 * s * Math.sin(i.direction));
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.moveTo((i.x - camera.x) * s + ((c.width - c.height) / 2), (i.y - camera.y) * s);
                for(j of i.trail){
                    ctx.lineTo((j[0] - camera.x) * s + ((c.width - c.height) / 2), (j[1] - camera.y) * s);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc((i.x - camera.x) * s + ((c.width - c.height) / 2), (i.y - camera.y) * s, i.size * s, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var platforms = [];

function platform(x, y, w, h){
    platforms.push(this);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.draw = () => {
        ctx.fillStyle = "black";
        ctx.fillRect((this.x - camera.x) * s + ((c.width - c.height) / 2), (this.y - camera.y) * s, this.w * s, this.h * s);
    }
    this.action = () => {

    }
}

function goal(x, y, w, h){
    platforms.push(this);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.draw = () => {
        ctx.fillStyle = "limegreen";
        ctx.fillRect((this.x - camera.x) * s + ((c.width - c.height) / 2), (this.y - camera.y) * s, this.w * s, this.h * s);
    }
    this.action = () => {
        p.won = true;
    }
}

function checkpoint(x, y, w, h){
    platforms.push(this);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.checked = false;

    this.draw = () => {
        ctx.fillStyle = "purple";
        if(this.checked){
            ctx.fillStyle = "hotpink";
        }
        ctx.fillRect((this.x - camera.x) * s + ((c.width - c.height) / 2), (this.y - camera.y) * s, this.w * s, this.h * s);
    }
    this.action = () => {
        if(!this.checked){
            p.spawnX = this.x + this.w / 2;
            p.spawnY = this.y - p.size;
            this.checked = true;
        }
    }
}

function hazard(x, y, w, h){
    platforms.push(this);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.draw = () => {
        ctx.fillStyle = "red";
        ctx.fillRect((this.x - camera.x) * s + ((c.width - c.height) / 2), (this.y - camera.y) * s, this.w * s, this.h * s);
    }
    this.action = () => {
        p.velocityY = 0;
        p.velocity = 0;
        p.trail = [];
        p.x = p.spawnX;
        p.y = p.spawnY;
        p.flying = false;
        p.direction = 0;
    }
}

function trigger(x, y, w, h, act){
    platforms.push(this);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.act = act;

    this.triggered = false;

    this.draw = () => {
        ctx.fillStyle = "green";
        if(this.triggered){
            ctx.fillStyle = "red";
        }
        ctx.fillRect((this.x - camera.x) * s + ((c.width - c.height) / 2), (this.y - camera.y) * s, this.w * s, this.h * s);
    }
    this.action = () => {
        if(!this.triggered){
            this.triggered = true;
            this.act();
        }
    }
}

function collidingWithPlatform(o){
    var plats = [];
    for(i of platforms){
        if(o.x - o.size < i.x + i.w && o.x + o.size > i.x && o.y - o.size < i.y + i.h && o.y + o.size > i.y){
            plats.push(i);
        }
    }

    return plats;
}

function dist(o1, o2){
    return Math.hypot(o1.y - o2.y, o1.x - o2.x);
}


function level1(){
    platforms = [];
    new platform(-0.2, 0.2, 0.4, 0.1);
    new platform(0.1, 0.21, 0.1, 0.49);
    new platform(0.1, 0.6, 0.6, 0.1);
    new hazard(0.2, 0.5, 0.4, 0.1);
    new platform(0.6, 0.21, 0.1, 0.49);
    new platform(0.6, 0.2, 0.3, 0.1);
    new platform(1.1, -0.1, 0.1, 0.6);
    var gate = new platform(2.69, 0.4, 0.12, 0.1);
    new trigger(1.7, 0.4, 0.31, 0.1, ()=>{
        new trigger(2.09999999, 0.4, 0.100001, 0.100001, ()=>{platforms.splice(platforms.indexOf(gate), 1);});
        new platform(2.0, -0.1, 0.1, 0.6);
        new platform(2.1, 0.5, 0.2, 0.1);
    });
    new platform(2.0, -0.1, 0.1, 0.6);
    
    new platform(2.6, 0.4, 0.1, 2);
    new platform(2.8, 0.4, 0.1, 2);

    new platform(-0.4, -0.2, 0.1, 1.6);
    new platform(3.0, -0.2, 0.1, 1.6);
    new platform(-0.4, 1.3, 3.01, 0.1);
    new hazard(-0.3, 1.2, 2.9, 0.1);
    new platform(2.89, 1.3, 0.12, 0.1);
    new hazard(2.9, 1.2, 0.1, 0.1);
    new checkpoint(2.7, 2.5, 0.1, 0.1);
}

level1();

setInterval(update, 1000/60);
for(let i = 0; i < 500; i++){p.trail.push([i/10, i/10])}
