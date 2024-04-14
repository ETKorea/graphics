let s;
let s2;
let scl = 20;
let food;
let item;
playfield = 600;
let timer = 500;

// p5js Setup function - required
function setup() {

  createCanvas(playfield, 640);
  background(51);
  s = new Snake(0, 0);
  s2 = new Snake(640, 0);
  frameRate (10);
  pickLocation(1);
  pickLocation(2);
}

// p5js Draw function - required
function draw() {
  background(51);
  scoreboard();
  if (timer > 0) {
    s.death();
    s.update();
    s.show(255, 0, 0);
    if (s.eat(food, 70, 200)) {
      pickLocation(1);
    }
    if (s.eat(item, 70, 200)) { // 아이템 먹었을 때의 동작 추가
      pickLocation(0); // 아이템 위치 없애기
    }
    s2.death();
    s2.update();
    s2.show(0, 255, 255);
    if (s2.eat(food, 370, 500)) {
      pickLocation(1);
    }
    if (s2.eat(item, 370, 500)) {
      pickLocation(0);
    }
    if(frameCount % (frameRate() * 3) == 0){
      pickLocation(2)
      //special(random(1,4));
    }
    fill("yellow"); //food 의 색상과 모양 설정
    ellipse(food.x + scl / 2, food.y + scl / 2, scl, scl);
    fill("lime"); // 아이템의 색상 모양 설정
    ellipse(item.x + scl / 2, item.y + scl / 2, scl, scl);
    textSize(15);//타이머 글자
    fill(255);
    text(timer, 290, 300);
    timer --;
  }
  if (timer == 0) {// 게임 종료 화면
    textSize(32);
    fill(255);
    text("Game Over", 220, 320);
    textSize(26);
    if(s.highscore > s2.highscore) text("Winner is player #1", 180, 350);
    else if(s.highscore < s2.highscore) text("Winner is player #2", 180, 350);
    else text("draw", 280, 350);

  }
}

// Pick a location for food to appear
function pickLocation(x) {
  let p = x;
  let cols = floor(playfield/scl);
  let rows = floor(playfield/scl);
  if(p == 1){
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
  }
  else if(p == 2){
    item = createVector(floor(random(cols)), floor(random(rows)));
    item.mult(scl);
  }
  else if(p == 0){
    item = createVector(-5,-5)
    item.mult(scl);
  }
  
// Check the food isn't appearing inside the tail
  
  for (let i = 0; i < s.tail.length; i++) {
    let pos = s.tail[i];
    let d = dist(food.x, food.y, pos.x, pos.y);
    if (d < 1) {
      pickLocation(1);
      return;
    }
  }
  for (let i = 0; i < s2.tail.length; i++) {
    let pos2 = s2.tail[i];
    let d2 = dist(food.x, food.y, pos2.x, pos2.y);
    if (d2 < 1) {
      pickLocation(1);
      return;
    }
  }

// Check the item isn't appearing instide the tail

  for (let i = 0; i < s.tail.length; i++) {
    let ipos = s.tail[i];
    let id = dist(item.x, item.y, ipos.x, ipos.y);
    if (id < 1) {
      pickLocation(1);
      return;
    }
  }
  for (let i = 0; i < s2.tail.length; i++) {
    let ipos2 = s2.tail[i];
    let id2 = dist(item.x, item.y, ipos2.x, ipos2.y);
    if (id2 < 1) {
      pickLocation(1);
      return;
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
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
        if (pos === food) { // 기존 음식을 먹었을 때의 동작
            this.total++;
            this.score++;
            if (this.score > this.highscore) {
                this.highscore = this.score;
            }
            return true;
        } else if (pos === item) { // 아이템을 먹었을 때의 동작
            if (this === s || this === s2) { // 현재 객체가 s 또는 s2일 때
                let rand = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
              if (rand == 1) { // 랜덤하게 하나의 동작 선택 ,그 중 점수2점
                this.score += 2; // 자신의 점수 증가
                this.total++;
                if (this.score > this.highscore) {
                  this.highscore = this.score;
                }
              }
              else if(rand == 2){// 상대의 점수 감소
                if (this === s && s2.score > 1) {
                  s2.score --; // s의 상대 점수 감소
                } else if (this === s2 && s.score > 1) {
                  s.score --; // s2의 상대 점수 감소
                }
              }
              else if(rand == 3){//자신의 꼬리 짧게 하기
                if (this === s) {
                  if(s.tail.length > 0){
                    s.tail = s.tail.filter((item, index) => index < s.tail.length - 1);
                    s.total--;
                  }
                } else if (this === s2) {
                  if(s2.tail.length > 0){
                    s2.tail = s2.tail.filter((item, index) => index < s2.tail.length - 1);
                    s2.total--;
                  }
                }
              }
              else if(rand == 4){//상대방 꼬리증가
                      if (this === s) {
                  s2.total++; // s의 상대 꼬리 증가
                } else if (this === s2) {
                  s2.total++; // s2의 상대 꼬리 증가
                }
              }
            }
            return true;
        }
    }
    return false;
  }
  this.death = function() {//캐릭터 초기화 조건
    if(this === s){//s1초기화
      for(let i = 0; i < s.tail.length; i++){//자신한테 
        let s1pos1 = s.tail[i];
        let s1d1 = dist(s.x, s.y, s1pos1.x, s1pos1.y);
        if (s1d1 < 1) {
          this.total = 0;
          this.score = 1;
          this.tail = [];
        }
      }
      for(let i = 0; i < s2.tail.length; i++){//s2한테 충돌
        let s1pos2 = s2.tail[i];
        let s1d2 = dist(s.x, s.y, s1pos2.x, s1pos2.y);
        if (s1d2 < 1) {
          this.total = 0;
          this.score = 1;
          this.tail = [];
        }
      }
  }
  if(this === s2){//s2초기화
      for(let i = 0; i < s2.tail.length; i++){//자신한테 충돌
        let s2pos1 = s2.tail[i];
        let s2d1 = dist(s2.x, s2.y, s2pos1.x, s2pos1.y);
        if (s2d1 < 1) {
          this.total = 0;
          this.score = 1;
          this.tail = [];
        }
      }
      for(let i = 0; i < s.tail.length; i++){//s한테 충돌
        let s2pos2 = s.tail[i];
        let s2d2 = dist(s2.x, s2.y, s2pos2.x, s2pos2.y);
        if (s2d2 < 1) {
          this.total = 0;
          this.score = 1;
          this.tail = [];
        }
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