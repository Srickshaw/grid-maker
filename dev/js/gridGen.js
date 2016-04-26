var gId = function(elemId) {
	return document.getElementById(elemId);
};

var gridMethods = (function() {
    var gridHolder = gId("gridContent");
	var gridWrapper = gId('grid');
    return {
        mainGen: function(height, width) {
            var newGrid = document.createElement('div');
            newGrid.style.height = (height * 25) + 'px';
            newGrid.style.width = (width * 25) + 'px';
            newGrid.style.border = '1px solid black';
            newGrid.style.position = 'relative';
			gridHolder.style.width = (width * 25) + 'px';
			gridWrapper.style.width = (width * 25) + 'px';
			gridHolder.style.height = (height * 25) + 'px';
			gridWrapper.style.height = (height * 25) + 'px';
            for (var i = 0; i < (height - 1); i++) {
                var newLine = this.genLine(1, (width * 25), ((i + 1) * 25), 0);
                newGrid.appendChild(newLine);
            }
            for (var j = 0; j < (width - 1); j++) {
                var newLine = this.genLine((height * 25), 1, 0, ((j + 1) * 25));
                newGrid.appendChild(newLine);
            }
            gridHolder.appendChild(newGrid);
        },
        genLine: function(height, width, top, left) {
            var line = document.createElement('div');
                line.style.height = height + 'px';
                line.style.width = width + 'px';
                line.setAttribute('class', 'lineMain');
                line.style.left = left + 'px'; 
                line.style.top = top + 'px';
                return line;
        },
		destroyGrid: function() {
			gridHolder.innerHTML = '';
		}
    }
})();

var blockMethods = function(){
	var blockList = {};
	return {
		getBlocklist: function() {
			return blockList;
		},
		getProp: function(prop) {
			return blockList[prop];
		},
		addToBlockList: function(prop, value) {
			blockList[prop] = value;
		},
		removeFromBlockList: function(prop) {
			delete blockList[prop];
		},
		clearBlocks: function() {
			document.querySelector('#blockHolder').innerHTML = '';
			for (var prop in blockList) { delete blockList[prop] };
		},
		generateBlock: function(left, top, className, blockId, bgColor) {
			var filledBlock = document.createElement('div');
			console.log('Top: ' + top + ' | Left: ' + left);
			filledBlock.style.top = (top + 1) + 'px';
			filledBlock.style.left = (left + 1) + 'px';
			filledBlock.setAttribute('class', className);
			filledBlock.setAttribute('id', blockId);
			filledBlock.style.backgroundColor = bgColor;
			return filledBlock;
		}
	}
}();

gId("gridGen").addEventListener('click', function(e) {
    e.preventDefault();
	blockMethods.clearBlocks();
   	gridMethods.destroyGrid();    
    gridMethods.mainGen(document.querySelector('#gHeight').value, document.querySelector('#gWidth').value);
	gId('gHeight').value = '';
	gId('gWidth').value = '';
});

gId('grid').addEventListener('mousemove', function(e) {
	var gridContent = document.querySelector('#grid');
	if(e.clientX > gridContent.offsetLeft && e.clientX < (gridContent.offsetLeft + gridContent.clientWidth) && e.clientY > gridContent.offsetTop && e.clientY < (gridContent.offsetTop + gridContent.clientHeight)) {
		document.querySelector('#coords').innerHTML = 'X Position: ' + (e.clientX - gridContent.offsetLeft) + ', Y Position: ' + (e.clientY - gridContent.offsetTop);
	}
});

gId('clearGrid').addEventListener('click', function(e) {
	e.preventDefault();
	blockMethods.clearBlocks();
});

gId('grid').addEventListener('click', function(e) {
	var gridContent = gId('grid');
	var clickXCoords = gId('clickXCoords');
	var clickYCoords = gId('clickYCoords');
	var blockHolder = gId('blockHolder');
	var fillColor = gId('fillColor');
	var xClick, yClick;		
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
	if (blockMethods.getBlocklist().hasOwnProperty(coords)) {
		if(fillColor.options[fillColor.selectedIndex].text == 'Transparent') {
			blockMethods.removeFromBlockList(coords);			
			blockHolder.removeChild(document.getElementById(coords));
		}
		else if(blockMethods.getProp(coords) != fillColor.options[fillColor.selectedIndex].text) {
			gId(coords).style.backgroundColor = fillColor.options[fillColor.selectedIndex].text;
			blockMethods.addToBlockList(coords, gId(coords).style.backgroundColor);
		}
		else {
			console.log('There is already a square of that color there!')
		}
	}
	else {
		var newBlock = blockMethods.generateBlock(xClick, yClick, 'filledBlock', coords, fillColor.options[fillColor.selectedIndex].text);
		blockHolder.appendChild(newBlock);
		blockMethods.addToBlockList(coords, newBlock.style.backgroundColor);
	}		
});