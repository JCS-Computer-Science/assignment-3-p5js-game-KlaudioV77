function setup() {
    createCanvas(900, 600);
    updateScoreboard();
}

class Player {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
}

class Ball {
    constructor(x, y, size, vx, vy, friction) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.friction = friction;
    }
}

function draw() {

    if (!gameOver) {
        matchTime += deltaTime / 1000;
        if (matchTime >= 90) {
            matchTime = 90;
            endGame();
        }
    }

    let seconds = floor(matchTime);
    let cs = floor((matchTime % 1) * 100);

    let display = nf(seconds, 2) + ":" + nf(cs, 2);

    document.getElementById("scoreText").innerText = display;

    background(0, 128, 0);

    fill(255);
    rect(450, 50, 10, 500);
    circle(454, 300, 200);
    rect(50, 50, 800, 10);
    rect(50, 550, 800, 10);
    rect(50, 50, 10, 500);
    rect(840, 50, 10, 500);
    rect(50, 167, 200, 10);
    rect(50, 433, 200, 10);
    rect(250, 167, 10, 276);
    rect(650, 167, 10, 276);
    rect(650, 433, 200, 10);
    rect(650, 164, 200, 10);
    circle(730, 300, 20);
    circle(170, 300, 20);

    fill(0, 128, 0);
    circle(454, 300, 185);

    fill(255);
    rect(450, 50, 10, 500);
    circle(455, 300, 20);

    fill(194, 197, 204);
    rect(0, 167, 50, 10);
    rect(0, 433, 50, 10);
    rect(850, 164, 50, 10);
    rect(850, 433, 50, 10);

    drawPlayer();
    movePlayer();
    drawBall();
    updateBall();
    drawPlayer2();
    movePlayer2();
    keyPressed();

    if (gameOver) {
        textSize(40);
        fill(0); textAlign(CENTER, CENTER);

        if (rightScore > leftScore) {
            player2 = 0;
            fill(255, 0, 0);
            text("Player 1 Wins!", width / 2, 200);
        }

        if (leftScore > rightScore) {
            player = 0;
            fill(0, 0, 255);
            text("Player 2 Wins!", width / 2, 200);
        }

        if (leftScore == rightScore) {
            text("Tie!", width / 2, 240);
        }
        ball = 0;
        text("GAME OVER", width / 2, 300);

        textSize(25);
        text("Press R to Restart", width / 2, 335);
    }

    if (gameState === "COUNTDOWN") {

        textSize(80);
        fill(0);
        textAlign(CENTER, CENTER);

        if (countdownTime > 0) {
            text(countdownTime, width / 2, height / 2);

            if (millis() - lastCountdownUpdate >= 250) {
                countdownTime--;
                lastCountdownUpdate = millis();
            }

        } else {
            text("GO!", width / 2, height / 2);

            if (!goTriggered) {
                goTriggered = true;
                setTimeout(() => {
                    gameState = "PLAYING";
                    goTriggered = false;
                }, 500);
            }
        }
    }

    if (goalMessageTimer > 0) {
        textSize(60);
        fill(0);
        textAlign(CENTER, CENTER);
        text(goalMessage, width / 2, 150);
        goalMessageTimer--;
    }
}

let goTriggered = false;
let gameState = "COUNTDOWN";
let countdownTime = 3;
let lastCountdownUpdate = 0;

let matchTime = 0;
let gameOver = false;

let goalMessage = "";
let goalMessageTimer = 0;

let player = new Player(200, 300, 40, 4);

let player2 = new Player(700, 300, 40, 4);

let rightTopPost = {
    left: 850,
    right: 900,
    top: 164,
    bottom: 174
};

let rightBottomPost = {
    left: 850,
    right: 900,
    top: 433,
    bottom: 443
};

let leftTopPost = {
    left: 0,
    right: 50,
    top: 167,
    bottom: 177
};

let leftBottomPost = {
    left: 0,
    right: 50,
    top: 433,
    bottom: 443
};

let ball = new Ball(450, 300, 30, 0, 0, 0.98);

let goalMode = false;

let leftScore = 0;
let rightScore = 0;

function drawPlayer() {
    fill(255, 0, 0);
    circle(player.x, player.y, 40);
}

function drawPlayer2() {
    fill(0, 0, 255);
    circle(player2.x, player2.y, 40);
}

function movePlayer2() {

    if (gameState !== "PLAYING") return;

    let r = player2.size / 2;

    if (keyIsDown(38)) {
        let nextY2 = player2.y - player2.speed;
        let nextX2 = player2.x;
        if (nextY2 > r) {
            if (!collidesWithRightTop(nextX2, nextY2, r) && !collidesWithLeftTop(nextX2, nextY2, r) && !collidesWithRightBottom(nextX2, nextY2, r) && !collidesWithLeftBottom(nextX2, nextY2, r)) {
                player2.y = nextY2;
            }
        }
    }

    if (keyIsDown(40)) {
        let nextY2 = player2.y + player2.speed;
        let nextX2 = player2.x;

        if (nextY2 < 600 - r) {
            if (!collidesWithRightTop(nextX2, nextY2, r) && !collidesWithLeftTop(nextX2, nextY2, r) && !collidesWithRightBottom(nextX2, nextY2, r) && !collidesWithLeftBottom(nextX2, nextY2, r)) {
                player2.y = nextY2;
            }
        }
    }

    if (keyIsDown(37)) {
        let nextX2 = player2.x - player2.speed;
        let nextY2 = player2.y;
        if (nextX2 > r) {
            if (!collidesWithLeftTop(nextX2, nextY2, r) && !collidesWithLeftBottom(nextX2, nextY2, r)) {
                player2.x = nextX2;
            }
        }
    }

    if (keyIsDown(39)) {
        let nextX2 = player2.x + player2.speed;
        let nextY2 = player2.y;

        if (nextX2 < 900 - r) {
            if (!collidesWithRightTop(nextX2, nextY2, r) && !collidesWithRightBottom(nextX2, nextY2, r)) {
                player2.x = nextX2;
            }
        }
    }

    let dx = ball.x - player2.x;
    let dy = ball.y - player2.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let minDist = (player2.size / 2) + (ball.size / 2);

    if (dist < minDist) {
        let angle = Math.atan2(dy, dx);
        ball.vx = Math.cos(angle) * 6;
        ball.vy = Math.sin(angle) * 6;
    }

    let playerDx = player.x - player2.x;
    let playerDy = player.y - player2.y;
    let playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
    let playerMinDist = (player.size / 2) + (player2.size / 2);

    if (playerDist < playerMinDist) {
        let angle = Math.atan2(playerDy, playerDx);
        let overlap = playerMinDist - playerDist;

        player.x += Math.cos(angle) * (overlap / 2);
        player.y += Math.sin(angle) * (overlap / 2);

        player2.x -= Math.cos(angle) * (overlap / 2);
        player2.y -= Math.sin(angle) * (overlap / 2);
    }
}

function movePlayer() {

    if (gameState !== "PLAYING") return;

    let r = player.size / 2;

    if (keyIsDown(87)) {
        let nextY = player.y - player.speed;
        let nextX = player.x;
        if (nextY > r) {
            if (!collidesWithRightTop(nextX, nextY, r) && !collidesWithLeftTop(nextX, nextY, r) && !collidesWithRightBottom(nextX, nextY, r) && !collidesWithLeftBottom(nextX, nextY, r)) {
                player.y = nextY;
            }
        }
    }

    if (keyIsDown(83)) {
        let nextY = player.y + player.speed;
        let nextX = player.x;

        if (nextY < 600 - r) {
            if (!collidesWithRightTop(nextX, nextY, r) && !collidesWithLeftTop(nextX, nextY, r) && !collidesWithRightBottom(nextX, nextY, r) && !collidesWithLeftBottom(nextX, nextY, r)) {
                player.y = nextY;
            }
        }
    }

    if (keyIsDown(65)) {
        let nextX = player.x - player.speed;
        let nextY = player.y;
        if (nextX > r) {
            if (!collidesWithLeftTop(nextX, nextY, r) && !collidesWithLeftBottom(nextX, nextY, r)) {
                player.x = nextX;
            }
        }
    }

    if (keyIsDown(68)) {
        let nextX = player.x + player.speed;
        let nextY = player.y;

        if (nextX < 900 - r) {
            if (!collidesWithRightTop(nextX, nextY, r) && !collidesWithRightBottom(nextX, nextY, r)) {
                player.x = nextX;
            }
        }
    }

    let dx = ball.x - player.x;
    let dy = ball.y - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let minDist = (player.size / 2) + (ball.size / 2);

    if (dist < minDist) {
        let angle = Math.atan2(dy, dx);
        ball.vx = Math.cos(angle) * 6;
        ball.vy = Math.sin(angle) * 6;
    }

    let playerDx = player.x - player2.x;
    let playerDy = player.y - player2.y;
    let playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
    let playerMinDist = (player.size / 2) + (player2.size / 2);

    if (playerDist < playerMinDist) {
        let angle = Math.atan2(playerDy, playerDx);
        let overlap = playerMinDist - playerDist;

        player.x += Math.cos(angle) * (overlap / 2);
        player.y += Math.sin(angle) * (overlap / 2);

        player2.x -= Math.cos(angle) * (overlap / 2);
        player2.y -= Math.sin(angle) * (overlap / 2);
    }
}

function updateBall() {

    if (gameState !== "PLAYING") return;

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= ball.friction;
    ball.vy *= ball.friction;

    let r = ball.size / 2;

    if (collidesWithRightTop(ball.x, ball.y, r)) {

        let closestX = ball.x;
        if (closestX < rightTopPost.left) closestX = rightTopPost.left;
        if (closestX > rightTopPost.right) closestX = rightTopPost.right;

        let closestY = ball.y;
        if (closestY < rightTopPost.top) closestY = rightTopPost.top;
        if (closestY > rightTopPost.bottom) closestY = rightTopPost.bottom;

        let dx = ball.x - closestX;
        let dy = ball.y - closestY;

        if (Math.abs(dx) < Math.abs(dy)) {
            ball.vy *= -0.6;
            if (ball.y < rightTopPost.top) ball.y = rightTopPost.top - r;
            else ball.y = rightTopPost.bottom + r;
        } else {
            ball.vx *= -0.6;
            if (ball.x < rightTopPost.left) ball.x = rightTopPost.left - r;
            else ball.x = rightTopPost.right + r;
        }
    }

    if (collidesWithLeftTop(ball.x, ball.y, r)) {

        let closestX = ball.x;
        if (closestX < leftTopPost.left) closestX = leftTopPost.left;
        if (closestX > leftTopPost.right) closestX = leftTopPost.right;

        let closestY = ball.y;
        if (closestY < leftTopPost.top) closestY = leftTopPost.top;
        if (closestY > leftTopPost.bottom) closestY = leftTopPost.bottom;

        let dx = ball.x - closestX;
        let dy = ball.y - closestY;

        if (Math.abs(dx) < Math.abs(dy)) {
            ball.vy *= -0.6;
            if (ball.y < leftTopPost.top) ball.y = leftTopPost.top - r;
            else ball.y = leftTopPost.bottom + r;
        } else {
            ball.vx *= -0.6;
            if (ball.x < leftTopPost.left) ball.x = leftTopPost.left - r;
            else ball.x = leftTopPost.right + r;
        }
    }

    if (collidesWithRightBottom(ball.x, ball.y, r)) {

        let closestX = ball.x;
        if (closestX < rightBottomPost.left) closestX = rightBottomPost.left;
        if (closestX > rightBottomPost.right) closestX = rightBottomPost.right;

        let closestY = ball.y;
        if (closestY < rightBottomPost.top) closestY = rightBottomPost.top;
        if (closestY > rightBottomPost.bottom) closestY = rightBottomPost.bottom;

        let dx = ball.x - closestX;
        let dy = ball.y - closestY;

        if (Math.abs(dx) < Math.abs(dy)) {
            ball.vy *= -0.6;
            if (ball.y < rightBottomPost.top) ball.y = rightBottomPost.top - r;
            else ball.y = rightBottomPost.bottom + r;
        } else {
            ball.vx *= -0.6;
            if (ball.x < rightBottomPost.left) ball.x = rightBottomPost.left - r;
            else ball.x = rightBottomPost.right + r;
        }
    }

    if (collidesWithLeftBottom(ball.x, ball.y, r)) {

        let closestX = ball.x;
        if (closestX < leftBottomPost.left) closestX = leftBottomPost.left;
        if (closestX > leftBottomPost.right) closestX = leftBottomPost.right;

        let closestY = ball.y;
        if (closestY < leftBottomPost.top) closestY = leftBottomPost.top;
        if (closestY > leftBottomPost.bottom) closestY = leftBottomPost.bottom;

        let dx = ball.x - closestX;
        let dy = ball.y - closestY;

        if (Math.abs(dx) < Math.abs(dy)) {
            ball.vy *= -0.6;
            if (ball.y < leftBottomPost.top) ball.y = leftBottomPost.top - r;
            else ball.y = leftBottomPost.bottom + r;
        } else {
            ball.vx *= -0.6;
            if (ball.x < leftBottomPost.left) ball.x = leftBottomPost.left - r;
            else ball.x = leftBottomPost.right + r;
        }
    }

    if (!goalMode && ball.x < 50 && 164 < ball.y && ball.y < 433) {
        goalMode = true;
        leftScore++;
        updateScoreboard();

        showRandomGoalMessage();

        setTimeout(() => {
            resetBall();
            resetPlayer();
            resetPlayer2();
            goalMode = false;

            countdownTime = 3;
            lastCountdownUpdate = millis();
            gameState = "COUNTDOWN";

        }, 1500);
    }

    if (!goalMode && ball.x > 850 && 164 < ball.y && ball.y < 433) {
        goalMode = true;
        rightScore++;
        updateScoreboard();

        showRandomGoalMessage();

        setTimeout(() => {
            resetBall();
            resetPlayer();
            resetPlayer2();
            goalMode = false;

            countdownTime = 3;
            lastCountdownUpdate = millis();
            gameState = "COUNTDOWN";

        }, 1500);
    }

    if (ball.x < r) {
        ball.x = r;
        ball.vx *= -0.5;
    }
    if (ball.x > 900 - r) {
        ball.x = 900 - r;
        ball.vx *= -0.5;
    }
    if (ball.y < r) {
        ball.y = r;
        ball.vy *= -0.5;
    }
    if (ball.y > 600 - r) {
        ball.y = 600 - r;
        ball.vy *= -0.5;
    }
}

function drawBall() {
    fill(255, 255, 255);
    circle(ball.x, ball.y, ball.size);
}

function collidesWithRightTop(cx, cy, r) {

    let closestX = cx;
    if (closestX < rightTopPost.left) closestX = rightTopPost.left;
    if (closestX > rightTopPost.right) closestX = rightTopPost.right;

    let closestY = cy;
    if (closestY < rightTopPost.top) closestY = rightTopPost.top;
    if (closestY > rightTopPost.bottom) closestY = rightTopPost.bottom;

    let dx = cx - closestX;
    let dy = cy - closestY;

    return dx * dx + dy * dy < r * r;
}

function collidesWithLeftTop(cx, cy, r) {

    let closestX = cx;
    if (closestX < leftTopPost.left) closestX = leftTopPost.left;
    if (closestX > leftTopPost.right) closestX = leftTopPost.right;

    let closestY = cy;
    if (closestY < leftTopPost.top) closestY = leftTopPost.top;
    if (closestY > leftTopPost.bottom) closestY = leftTopPost.bottom;

    let dx = cx - closestX;
    let dy = cy - closestY;

    return dx * dx + dy * dy < r * r;
}

function collidesWithRightBottom(cx, cy, r) {

    let closestX = cx;
    if (closestX < rightBottomPost.left) closestX = rightBottomPost.left;
    if (closestX > rightBottomPost.right) closestX = rightBottomPost.right;

    let closestY = cy;
    if (closestY < rightBottomPost.top) closestY = rightBottomPost.top;
    if (closestY > rightBottomPost.bottom) closestY = rightBottomPost.bottom;

    let dx = cx - closestX;
    let dy = cy - closestY;

    return dx * dx + dy * dy < r * r;
}

function collidesWithLeftBottom(cx, cy, r) {

    let closestX = cx;
    if (closestX < leftBottomPost.left) closestX = leftBottomPost.left;
    if (closestX > leftBottomPost.right) closestX = leftBottomPost.right;

    let closestY = cy;
    if (closestY < leftBottomPost.top) closestY = leftBottomPost.top;
    if (closestY > leftBottomPost.bottom) closestY = leftBottomPost.bottom;

    let dx = cx - closestX;
    let dy = cy - closestY;

    return dx * dx + dy * dy < r * r;
}

function resetBall() {
    ball.vx = 0;
    ball.vy = 0;
    ball.x = 450;
    ball.y = 300;
}

function resetPlayer() {
    player.x = 200;
    player.y = 300;
}

function resetPlayer2() {
    player2.x = 700;
    player2.y = 300;
}

function updateScoreboard() {
    document.getElementById("scoreboard").innerText = 'Score:' + rightScore + ' - ' + leftScore;
}

function endGame() {
    gameOver = true;
}

function keyPressed() {
    if (gameOver && key === 'r') {
        restartMatch();
    }
}

function restartMatch() {
    gameOver = false;
    matchTime = 0;
    leftScore = 0;
    rightScore = 0;

    player = new Player(200, 300, 40, 4);
    player2 = new Player(700, 300, 40, 4);
    ball = new Ball(450, 300, 30, 0, 0, 0.98);

    goalMode = false;

    countdownTime = 3;
    lastCountdownUpdate = millis();
    gameState = "COUNTDOWN";

    updateScoreboard();
}

function showRandomGoalMessage() {
    fill(0)
    let messages = ["GOAL!!!", "WOW!", "SIUUU!", "GOLAZO!"];
    goalMessage = messages[Math.floor(Math.random() * messages.length)];
    goalMessageTimer = 50;
}
