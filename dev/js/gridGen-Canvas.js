'use strict';

var testArray = [];
var gridData = [];

var gId = function(elemId) {
	return document.getElementById(elemId);
};


function generateGrid(height, width) {
	var adjHeight = (height * 25);
	var adjWidth = (width * 25);
	gId('grid').style.height = adjHeight + 'px';
	gId('grid').style.width = adjWidth + 'px';	
	var cElem = document.createElement('canvas');
	cElem.setAttribute('width', adjWidth);
	cElem.setAttribute('height', adjHeight);
	cElem.setAttribute('class', 'canvasGrid');
	cElem.setAttribute('id', 'canvasGrid');
	for (var i = 0; i <= height; i++) {
		genLine(1, adjWidth, (i * 25), 0, cElem);		
	}
	for (var i = 0; i <= width; i++) {
		genLine((height * 25), 1, 0, (i * 25), cElem);
	}
	return cElem;
}

function genLine(height, width, top, left, canvasElement) {
	var cLine = canvasElement.getContext('2d');	
	cLine.fillStyle = 'black';	
	cLine.fillRect(left, top, width, height);
}

function genBlock(left, top, color, canvasElement) {
	var cBlock = canvasElement.getContext('2d');
	var blockObj = {};	
	if(color.toLowerCase() == 'clear') {
		blockObj.y = left;
		blockObj.x = top;
		for (var i = 0; i < testArray.length; i++) {
			if (testArray[i].x == blockObj.x) {
				console.log(blockObj.x);
				if(testArray[i].y == blockObj.y) {
					console.log(blockObj.y);
					testArray.splice(i, 1);
				}
			}
		}
		cBlock.clearRect(left, top, 24, 24);		
	}
	else {
		cBlock.fillStyle = color;
		cBlock.fillRect(left, top, 24, 24);
		blockObj.y = left;
		blockObj.x = top;
		blockObj.color = color;
		for (var i = 0; i < testArray.length; i++) {
			if (testArray[i].x == blockObj.x) {
				console.log(blockObj.x);
				if(testArray[i].y == blockObj.y) {
					console.log(blockObj.y);
					testArray.splice(i, 1);
				}
			}
		}
		testArray.push(blockObj);
		console.log(testArray);
	}
}

function createFill(height, width, color, canvasElement) {
	var fillBlock = canvasElement.getContext('2d');	
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			if (color.toLowerCase() === 'clear') {
				fillBlock.clearRect(((j * 25) + 1), ((i * 25) + 1), 24, 24);
				testArray = [];
			}
			else {
				fillBlock.fillStyle = color;
				fillBlock.fillRect(((j * 25) + 1), ((i * 25) + 1), 24, 24);				
			}
		}
	}
}

gId('gridGen').addEventListener('click', function(e) {
	gId('grid').innerHTML = '';
	var gridElement = generateGrid(gId('gHeight').value, gId('gWidth').value);
	gId('grid').appendChild(gridElement);
});

gId('grid').addEventListener('mousemove', function(e) {
	gId('coords').innerHTML = 'X Position: ' + (e.clientX - gId('grid').offsetLeft) + ', Y Position: ' + (e.clientY - gId('grid').offsetTop);
});

gId('clearGrid').addEventListener('click', function() {
	createFill(gId('canvasGrid').getAttribute('height'),gId('canvasGrid').getAttribute('width'), 'Clear', gId('canvasGrid'));
});

gId('createFill').addEventListener('click', function() {
	var fillColor = gId('fillColor');
	createFill(gId('fillHeight').value, gId('fillWidth').value, fillColor.options[fillColor.selectedIndex].text, gId('canvasGrid')); 
});

gId('saveData').addEventListener('click', function() {
	var gridSize = { height: gId('canvasGrid').getAttribute('height'), width: gId('canvasGrid').getAttribute('width') };	
	testArray.push(gridSize);
	localStorage.setItem('gridData', JSON.stringify(testArray));
	console.log(localStorage.gridData);
});

gId('restoreData').addEventListener('click', function() {
	if(localStorage) {
		var restoredGridData = localStorage.getItem('gridData');
		var restoredData = JSON.parse(restoredGridData);
		if(restoredData.length === 1) {
			var gridHeight = restoredData[0].height / 25;
			var gridWidth = restoredData[0].width / 25;
			gId('grid').innerHTML = '';
			var gridElement = (generateGrid(gridHeight, gridWidth));
			gId('grid').appendChild(gridElement);
		}
		else if(restoredData.length > 1) {
			var gridHeight = restoredData[restoredData.length - 1].height / 25;
			var gridWidth = restoredData[restoredData.length - 1].width / 25;
			gId('grid').innerHTML = '';
			var gridElement = (generateGrid(gridHeight, gridWidth));
			gId('grid').appendChild(gridElement);
			for (var i = 0; i < (restoredData.length - 1); i++) {
				genBlock(restoredData[i].y, restoredData[i].x, restoredData[i].color, gId('canvasGrid'));
			}
		}
		else { console.log("There's no data to recover!");  }
	}
});

document.querySelector('body').addEventListener('click', function(e) {
	if (e.target.tagName.toLowerCase() == 'canvas') {
		var clickXCoords = gId('clickXCoords');
		var clickYCoords = gId('clickYCoords');
		var xClick, yClick;
		var fillColor = gId('fillColor');
		var coords;
		if ((e.clientX - 10) % 25 != 0) {		
				xClick = ((e.clientX - 10) - ((e.clientX - 10) % 25));			
				if(xClick < 0) { xClick = 0; }
				clickXCoords.innerHTML = 'X position (rounded to nearest tenth): ' + xClick;				
		}
		if ((e.clientY - 35) % 25 != 0) {		
				yClick = ((e.clientY - 35) - ((e.clientY - 35) % 25));			
				if(yClick < 0) { yClick = 0; }
				clickYCoords.innerHTML = 'Y position (rounded to nearest tenth): ' + yClick;				
		}
		else if((e.clientX - 10) % 25 === 0) { xClick = (e.clientX - 10); }
		else if((e.clientY - 35) % 25 === 0) { yClick = (e.clientY - 35); }
		genBlock((xClick + 1), (yClick + 1), fillColor.options[fillColor.selectedIndex].text, gId('canvasGrid'));
	}
});
