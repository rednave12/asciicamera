/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 
 /////// SAMPLE BY webRTC, ADAPTED BY REDNAVE12 /////////

'use strict';

// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = document.querySelector('#vid');
const canv2 = document.querySelector('#canv2');
const ctx = canvas.getContext('2d');
const ctx2 = canv2.getContext('2d');
canvas.width = 480;
canvas.height = 360;
canv2.width = 480;
canv2.height = 360;

async function camToCanvas() {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	
	canv2.width = video.videoWidth;
	canv2.height = video.videoHeight;
	
	ctx.translate(canvas.width, 0); //flip video 
	ctx.scale(-1, 1);
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	
	await window.requestAnimationFrame(camToCanvas);
	
	let pix = await grayScale();
	let brightVals = await splitPixels(pix);
	let ascii = await convertToAscii(brightVals);
	document.querySelector('.ascii').innerHTML = ascii;
}

function grayScale() {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imageData.data;
	
	for(let i = 0; i < pixels.length; i+=4) {
		let r = pixels[i+0];
		let g = pixels[i+1];
		let b = pixels[i+2];
		let a = pixels[i+3];
		
		let contrast = 100; //increasing the contrast
		let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
		
		var newRed   = factor * (r - 128) + 128;
		if (newRed > 255) { 
			newRed = 255;
		} else if (newRed < 0) {
			newRed = 0;
		}
		
		var newGreen = factor * (g - 128) + 128;
		if (newGreen > 255) { 
			newGreen = 255;
		} else if (newGreen < 0) {
			newGreen = 0;
		}
		
		var newBlue  = factor * (b  - 128) + 128;
		if (newBlue > 255) { 
			newBlue = 255;
		} else if (newBlue < 0) {
			newBlue = 0;
		}
		
		//pixels[i+0] = newRed;
		//pixels[i+1] = newBlue;
		//pixels[i+2] = newGreen;
		
		let bw = (0.3 * newRed) + (0.59 * newGreen) + (0.11 * newBlue); //weighted grayscale
		//let bw = (r+g+b)/3;
			
		pixels[i+0] = bw;
		pixels[i+1] = bw;
		pixels[i+2] = bw;
	}
	ctx2.putImageData(imageData, 0, 0);
	console.log("pix" + "=" + pixels.length);
	return pixels;
}

function splitPixels(pixels) {
	var resX = 4;
	var resY = 3*(resX/2);
	//var resY = 2*resX
	
	var asciiW = canv2.width / resX;
	var asciiH = canv2.height / resY;
	
	var brightVals = Array(asciiW * asciiH);
	
	for (var y = 0; y < canv2.height; y+= resY) {
		for (var x = 0; x < canv2.width; x+= resX) {
			var index = x + y*canv2.width;
			brightVals[index] = pixels[index*4] / 255;
		}
	}
	console.log("bvals" + "=" + brightVals.length);
	return brightVals;
}

function convertToAscii(arr) {
	var ascii = "";
	
	for (var i = 0; i < arr.length; i++) {
		
				
		if (i % 640 == 0 && i != 0) {
			ascii += "\n";
		}
		
		if (arr[i] >= 0 && arr[i] < 0.1) {
			ascii += "@";
		} else if (arr[i] >= 0.1 && arr[i] < 0.2) {
			ascii += "F";
		} else if (arr[i] >= 0.2 && arr[i] < 0.3) {
			ascii += "E";
		} else if (arr[i] >= 0.3 && arr[i] < 0.4) {
			ascii += "L";
		} else if (arr[i] >= 0.4 && arr[i] < 0.5) {
			ascii += "l";
		} else if (arr[i] >= 0.5 && arr[i] < 0.6) {
			ascii += "v";
		} else if (arr[i] >= 0.6 && arr[i] < 0.7) {
			ascii += "!";
		} else if (arr[i] >= 0.7 && arr[i] < 0.8) {
			ascii += ";";
		} else if (arr[i] >= 0.8 && arr[i] < 0.9) {
			ascii += ",";
		} else if (arr[i] >= 0.9 && arr[i] <= 1.0) {
			ascii += ".";
		}

		

	}
	
	return ascii;
	
}

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

video.pause();
video.style.display='none';
canvas.style.display='none';
canv2.style.display='none';
navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
window.requestAnimationFrame(camToCanvas);