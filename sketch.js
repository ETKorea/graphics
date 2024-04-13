let s;
let s2; //2인용 플레이어를 위한 변수생성 이하 s2 생략
let scl = 20;
let food;
playfield = 600;

// p5js Setup function - required

function setup() {

  createCanvas(playfield, 640);
  background(51);
  s = new Snake(0,0);
  s2 = new Snake(640,0);
  frameRate (10); // 프레임조정필요
  pickLocation();
}

// p5js Draw function - required

function draw() {

  background(51);
  scoreboard();
  if (s.eat(food, 70, 200)) {
    pickLocation();
  }

  s.death();
  s.update();
  s.show(0, 255, 0);
  if(s2.eat(food, 370, 500)){
    pickLocation();
  }
  s2.death();
  s2.update();
  s2.show(0, 0, 255);

  fill("yellow"); // 음식의 색상 설정
  ellipse(food.x + scl / 2, food.y + scl / 2, scl, scl); // 음식 모양 변경

}

// Pick a location for food to appear

function pickLocation() {

  let cols = floor(playfield/scl);
  let rows = floor(playfield/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);

  // Check the food isn't appearing inside the tail

  for (let i = 0; i < (s.tail.length && s2.tail.length); i++) {
    let pos = s.tail[i];
    let pos2 = s2.tail[i];
    let d = dist(food.x, food.y, pos.x, pos.y);
    let d2 = dist(food.x, food.y, pos2.x, pos2.y);
    if (d < 1) {
      pickLocation();
    }
  }
}

// scoreboard

function scoreboard() {

  fill(0);
  rect(0, 600, 300, 40);
  fill(255);
  textFont("Georgia");
  textSize(18);
  text("Score: ", 10, 625);
  text(s.score, 70, 625);
  text("Highscore: ", 100, 625);
  text(s.highscore, 200, 625);
  fill(255);
  rect(300, 600, 300, 40);
  fill(0);
  textFont("Georgia");
  textSize(18);
  text("Score: ", 310, 625);
  text(s2.score, 370, 625);
  text("Highscore: ", 400, 625);
  text(s2.highscore, 500, 625);
}

 

// CONTROLS function

 

function keyPressed() {

  if (keyCode === UP_ARROW){
      s.dir(0, -1);
  }else if (keyCode === DOWN_ARROW) {
      s.dir(0, 1);
  }else if (keyCode === RIGHT_ARROW) {
      s.dir (1, 0);
  }else if (keyCode === LEFT_ARROW) {
      s.dir (-1, 0);
  }
  if (keyCode === 87){
      s2.dir(0, -1);
  }else if (keyCode === 83) {
      s2.dir(0, 1);
  }else if (keyCode === 68) {
      s2.dir (1, 0);
  }else if (keyCode === 65) {
      s2.dir (-1, 0);
  }
}

 

// SNAKE OBJECT

 

function Snake(x, y) {

  this.x = x;
  this.y = y;
  this.xspeed = 0;
  this.yspeed = 1;
  this.total = 0;
  this.tail = [];
  this.score = 1;
  this.highscore = 1;

 

  this.dir = function(x,y) {

    this.xspeed = x;
    this.yspeed = y;
  }

 

  this.eat = function(pos, scoret, Hight) {
    this.scoret = scoret;
    this.Hight = Hight;
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score++;
      text(this.score, scoret, 625);//없어도될거같습니다.
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }
      text(this.highscore, this.Hight, 625);//없어도될거같습니다.
      return true;
    } 
    else {
      return false;
    }
  }

 

  this.death = function() {

    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.score = 0;
        this.tail = [];
      }
    }
  }

 

  this.update = function(){
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
    }
    }

    this.tail[this.total-1] = createVector(this.x, this.y);
    this.x = this.x + this.xspeed*scl;
    this.y = this.y + this.yspeed*scl;

    this.x = constrain(this.x, 0, playfield-scl);
    this.y = constrain(this.y, 0, playfield-scl);

  }

  this.show = function(c1, c2, c3){//매개변수를 받아 각각의 색 지정가능하도록
    this.c1 = c1;
    this.c2 = c2;
    this.c3 = c3;
    fill(255);
    for (let i = 0; i < this.tail.length; i++) {
      fill(this.c1, this.c2, this.c3);
      ellipse(this.tail[i].x + scl / 2, this.tail[i].y + scl / 2, scl, scl);
    }
    fill(this.c1, this.c2, this.c3); // 뱀의 머리를 노란색으로 채우기
    // 방향키에 따라 뱀의 머리 방향 전환
    if (this.yspeed === -1) { // 위로 이동 중
      arc(this.x + scl / 2, this.y + scl / 2, scl, scl, radians(315), radians(225));
    } else if (this.yspeed === 1) { // 아래로 이동 중
      arc(this.x + scl / 2, this.y + scl / 2, scl, scl, radians(135), radians(45));
    } else if (this.xspeed === -1) { // 왼쪽으로 이동 중
      arc(this.x + scl / 2, this.y + scl / 2, scl, scl, radians(225), radians(135));
    } else if (this.xspeed === 1) { // 오른쪽으로 이동 중
      arc(this.x + scl / 2, this.y + scl / 2, scl, scl, radians(45), radians(-45));
    } else { // 방향이 없는 경우
      arc(this.x + scl / 2, this.y + scl / 2, scl, scl, radians(225), radians(135));
    }
  }
}