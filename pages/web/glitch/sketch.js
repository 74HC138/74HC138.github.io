let img;
let imgBW;
let imgRed;
let imgCyan;
var offsetCyan = 0;
var offsetRed = 2;



function preload() {
	img = loadImage("deer.jpg");
}
function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('sketch-holder');
	img.resize(canvas.width+30, 0);
	imgBW = makeBW(img);
	imgCyan = makeMask(makeBW_bo(img), 150, color(0, 220, 220, 150));
	imgCyan = crossOver(imgBW, imgCyan, 15);
	imgRed = makeMask(makeBW_bo(img), 150, color(220, 0, 0, 150));
	imgRed = crossOver(imgBW, imgRed, -15);
	
}
function draw() {
	image(imgBW, -15, 0);
	image(imgCyan, -30+(sin(offsetCyan)*8), 0);
	image(imgRed, 0+(sin(offsetRed)*8), 0);
	offsetCyan = offsetCyan+0.01;
	offsetRed = offsetRed+0.01;
}
function makeBW(img) {
	img.loadPixels();
	let out = createImage(img.width, img.height);
	out.loadPixels();
	for (var i = 0; i < img.width*img.height*4; i=i+4) {
		let level = (img.pixels[i]+img.pixels[i+1]+img.pixels[i+2])/3;
		out.pixels[i] = level;
		out.pixels[i+1] = level;
		out.pixels[i+2] = level;
		out.pixels[i+3] = img.pixels[i+3];
	}
	out.updatePixels();
	return out;
}
function makeBW_bo(img) {
	img.loadPixels();
	let out = createImage(img.width, img.height);
	out.loadPixels();
	for (var i = 0; i < img.width*img.height*4; i=i+4) {
		let level = img.pixels[i+2];
		out.pixels[i] = level;
		out.pixels[i+1] = level;
		out.pixels[i+2] = level;
		out.pixels[i+3] = img.pixels[i+3];
	}
	out.updatePixels();
	return out;
}
function crossOver(background, generated, offset) {
	background.loadPixels();
	generated.loadPixels();
	let out = createImage(img.width, img.height);
	out.loadPixels();
	for (var y = 0; y < background.height; y++) {
		for (var x = 0; x < background.width*4; x=x+4) {
			var pixelAdr = x+(y*background.width*4);
			var alpha;
			if (generated.pixels[pixelAdr+3] <= 2) {
				alpha = 1;
			} else {
				if((x/4)-offset >= background.width) {
					alpha = 1;
				} else {
					var offsetAdr = (x-(offset*4))+(y*background.width*4);
					var level = (background.pixels[offsetAdr+0]+background.pixels[offsetAdr+1]+background.pixels[offsetAdr+2])/3;
					alpha = log(map(level, 0, 255, 0, 3))*generated.pixels[pixelAdr+3];
				}
			}
			out.pixels[pixelAdr+0] = generated.pixels[pixelAdr+0];
			out.pixels[pixelAdr+1] = generated.pixels[pixelAdr+1];
			out.pixels[pixelAdr+2] = generated.pixels[pixelAdr+2];
			out.pixels[pixelAdr+3] = alpha;
		}
	}
	out.updatePixels();
	return out;
}
function makeMask(img, threshold, maskColor) {
	img.loadPixels();
	let out = createImage(img.width, img.height);
	out.loadPixels();
	for (var i = 0; i < img.width*img.height*4; i=i+4) {
		var level = (img.pixels[i]+img.pixels[i+1]+img.pixels[i+2])/3;
		if (level <= threshold) {
			out.pixels[i] = red(maskColor);
			out.pixels[i+1] = green(maskColor);
			out.pixels[i+2] = blue(maskColor);
			out.pixels[i+3] = alpha(maskColor);
		} else {
			out.pixels[i] = 0;
			out.pixels[i+1] = 0;
			out.pixels[i+2] = 0;
			out.pixels[i+3] = 1;
		}
	}
	out.updatePixels();
	return out;
}
function mouseClicked() {
	toggleMusic();
}
	
	
	
	
	