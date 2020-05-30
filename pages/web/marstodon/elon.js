var musk = {
    sleep: 0,
    position: {
        x: 0,
        y: 0
    },
    acceleration: {
        x: 0,
        y: 0
    },
    hops: 0,
    hopDir: 0 //1 == left (-x), enything else == right (+x)
};
var floorHeight;
var gravity = 0.8;
var frameCounter = 0;

function init() {
    console.log("init function")
    canvas = document.getElementById("elon");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvasW = canvas.width;
    canvasH = canvas.height;
    console.log("canvas is now fullscreen");

    if (canvas.getContext) {
        setup();
        setInterval(run, 1000 / 30); //30 frames per second
        console.log("interval timer set for run()");    
    } else {
        console.log("[error] could not open iframe context");
    }
}
function setup()  {
    console.log("running setup");
    canvas = document.getElementById("elon");
    ctx = canvas.getContext('2d');
    elonImage = new Image();
    elonImage.src = "elon.png";
    elonImageFlipped = new Image();
    elonImageFlipped.src = "elonFlipped.png";

    elonWidth = canvasW / 6;
    elonHeight = (elonWidth / elonImage.width) * elonImage.height;
    floorHeight = canvasH - elonHeight;

    musk.position.x = canvasW;
    musk.position.y = floorHeight;
    musk.acceleration.x = -6;
    musk.acceleration.y = 8;
    musk.hopDir = 1;
    musk.hops = 6;
}
function run() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCounter++;
    if (frameCounter % 1 == 0) {
        if (musk.hopDir == 1) {
            particle(musk.position.x + (elonWidth * 0.43), musk.position.y + (elonHeight * 0.77));
        } else {
            particle(musk.position.x + (elonWidth * 0.57), musk.position.y + (elonHeight * 0.77));
        }
    }
    if (musk.hopDir == 1) {
        ctx.drawImage(elonImage, musk.position.x, musk.position.y, elonWidth, elonHeight);
    } else {
        ctx.drawImage(elonImageFlipped, musk.position.x, musk.position.y, elonWidth, elonHeight);
        //drawFlipped(elonImage, musk.position.x, musk.position.y, elonWidth, elonHeight);
    }
    update();
    render();
    if (musk.sleep > 0) {
        musk.sleep = musk.sleep - 1;
        if (musk.sleep == 0) {
            //random configs
            musk.hops = Math.round(Math.random() * 10);
            if (musk.position.x < 0) {
                musk.hopDir = -1;
                musk.acceleration.x = 6;
                musk.acceleration.y = 8;
            } else if (musk.position.x > canvasW - elonWidth) {
                musk.hopDir = 1;
                musk.acceleration.x = -6;
                musk.acceleration.y = 8;
            } else {
                if (Math.random() > 0.5) {
                    musk.hopDir = 1;
                    musk.acceleration.x = -6;
                    musk.acceleration.y = 8;
                } else {
                    musk.hopDir = -1;
                    musk.acceleration.x = 6;
                    musk.acceleration.y = 8;
                }
            }
        }
    } else {
        musk.position.x = musk.position.x + musk.acceleration.x;
        musk.position.y = musk.position.y - musk.acceleration.y;
        if (musk.position.y > floorHeight) {
            if (musk.hops > 0) {
                if (musk.position.x < 0) {
                    if (musk.hopDir == 1) {
                        musk.hops = 0;
                    }
                }
                if (musk.position.x > canvasW - elonWidth) {
                    if (musk.hopDir != 1) {
                        musk.hops = 0;
                    }
                }
            }
            if (musk.hops > 0) {
                musk.hops = musk.hops - 1;
                musk.position.y = floorHeight;
                musk.acceleration.y = 6;
                
            } else {
                musk.position.y = floorHeight;
                musk.acceleration.y = 0;
                musk.acceleration.x = 0;
                musk.sleep = Math.round((Math.random() + 1) * 120);
                console.log("sleep time: " + musk.sleep)
            }
        }
        if (musk.position.y < floorHeight) {
            musk.acceleration.y = musk.acceleration.y - gravity;
        }
    }
    
}
function drawFlipped(image, x, y, width, height) {
    ctx.scale(-1, 1);
    ctx.drawImage(image, -x - width, y, width, height);
    ctx.scale(1, 1);
}

var particles = [];
var maximumParticles = 400;
var maximumLifetime = 40;

function particle(x, y) {
    if (particles.length < maximumParticles) {
        particles[particles.length] = {'x':x, 'y':y, 'vx':(Math.random()-0.5)*2, 'vy':-4+Math.random(), 'life': 0};
    }
}
function update() {
    for (i = 0; i < particles.length; i++) {
        if (particles[i]) {
            particles[i].x += particles[i].vx;
            particles[i].y += particles[i].vy;
            particles[i].life++;

            if (particles[i].life > maximumLifetime) {
                particles.splice(i, 1);
            }
        }
    }
}
function render() {
    for (i = 0; i < particles.length; i++) {
        if (particles[i]) {
            var alpha = -(particles[i].life / maximumLifetime) + 1;
            ctx.fillStyle = `rgba(240, 240, 240, ${alpha})`;
            ctx.fillRect(particles[i].x, particles[i].y, 10, 10);
        }
    }
}
