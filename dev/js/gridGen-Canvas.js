'use strict';

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

function genBlock(left, top, color, blockId, blockClass, canvasElement) {
	var cBlock = canvasElement.getContext('2d');
	if(color.toLowerCase() == 'clear') {
		cBlock.clearRect(left, top, 24, 24);
	}
	else {
		cBlock.fillStyle = color;
		cBlock.fillRect(left, top, 24, 24);
	}
}

function clearBlock(height, width, canvasElement) {
	var clearBlock = canvasElement.getContext('2d');
	for (var i = 0; i <= height; i++) {
		for (var j = 0; j <= width; j++) {
			clearBlock.clearRect(((j * 25) + 1), ((i * 25) + 1), 24, 24);
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

gId('clearGrid').addEventListener('click', function(e) {
	clearBlock(gId('canvasGrid').getAttribute('height'),gId('canvasGrid').getAttribute('width'),gId('canvasGrid'));
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
		coords = xClick + 'x' + yClick;
		genBlock((xClick +1), (yClick + 1), fillColor.options[fillColor.selectedIndex].text, coords, 'filledBlock', gId('canvasGrid'));
	}
});