
//vaporwave
var sx = 120;
var sy = 100;
var mult;
var points = [];
var depth;

function drawRasterH(y) {
  tinty(y);
  noFill();
  beginShape();
  for (var i = 0; i < sx; i++) {
    vertex(i*(width/sx), toZ(points[i][y], i,  y), y*(depth/sy));
  }
  endShape();
}
function drawRasterV(x) {
  noFill();
  beginShape();
  for (var a = 0; a < sy; a++) {
    tinty(a);
    noFill();
    vertex(x*(width/sx), toZ(points[x][a], x, a), a*(depth/sy));
  }
  endShape();
}
function tinty(y) {
  var hue = map(y, 0, sy, 245, 345);
  stroke(color(hue, 100, 80));
  fill(color(hue, 100, 100));
  //stroke(255);
  //fill(255);
}
function toZ(z, x, y) {
  return (z*20)+map(y, 0, sy+10, height/10, (height/4)*3)+(sin((var)(x-y)/20+mult))*20+30;//+curveFunktion(x,y);
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  var width = window.innerWidth;
  var height = window.innerHeight;
  depth = height;
  for (var i = 0; i < sx; i++) {
	points[i] = [];
    for (var a = 0; a < sy; a++) {
      points[i][a] = ns2d(i/6,a/6);
    }
  }
  colorMode(HSB, 360, 100, 100);
  mult = 0;
}

function draw() {
  background(0);
  for (var a = 0; a < sy; a++) {
    drawRasterH(a);
  }
  for (var i = 0; i < sx; i++) {
    drawRasterV(i);
  }
  mult=mult+0.015;
  //println(frameRate);
}