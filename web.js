var fs = require('fs'),
	gm = require('gm'),
	app = require('express')();

var CONFIG = {
	imagesPath: './img'
};

var imagePaths = fs.readdirSync(CONFIG.imagesPath).filter(function(path){
	return /\.jpg/.test(path);
});

var utils = {
	_rand: function(min, max){
		return Math.floor(Math.random() * max) + min;
	},

	_getRandomImagePath: function(){
		return imagePaths[this._rand(0, (imagePaths.length-1))];
	},

	_getRandomImagePathBiggerThan: function(width, height, callback){
		var timesTried = 1,
			maxTries = imagePaths.length,
			self = this;

		var getImagePath = function(callback){
			var imagePath = CONFIG.imagesPath+'/'+self._getRandomImagePath();

			gm(imagePath)
			.size(function(err, size){
			  	if(err){
			  		console.error('GM GET SIZE ERROR', err);
			  		return;
			  	}

			  	if(size.width >= width && size.height >= height){
			  		console.log('IMG_FOUND', size.width, width, size.height, height, imagePath);
			  		callback(imagePath);
			  	} else {
			  		callback('');
			  	}
			});
		};

		var whileLoop = function(){
			getImagePath(function(value){
				if(timesTried >= maxTries && !value){
					//nope
					callback('');
				} else if(timesTried <= maxTries && !value){
					//try
					whileLoop();
				} else {
					//success
					callback(value);
				}
				timesTried++;
			});
		};
		whileLoop();
	},

	sendRandomImageForSizes: function(width, height, res){
		this._getRandomImagePathBiggerThan(width, height, function(imagePath){

			if(!imagePath){
				console.error('IMAGE PATH ERR IMAGE_PATH: "'+imagePath+'"');
				res.end('No image found');
				return;
			}

			gm(imagePath)
			.resize(width, height, '^')
			.gravity('Center')
		  	.crop(width, height)
			.toBuffer('JPG',function(err, buffer){
			  	if(err){
			  		console.error(err);
			  		return;
			  	}

			  	res.set('Content-Type', 'image/jpg;base64');
				res.end(buffer);
			});

		});
	}
};

var MainController = function(req, res){
	var width = req.params.width,
		height = req.params.height;

	if(isNaN(width) || isNaN(height)){
		res.end('Both with and height need to be numbers');
		return;
	}

	width = Number(req.params.width);
	height = Number(req.params.height);

	utils.sendRandomImageForSizes(width, height, res);
};

var SquareController = function(req, res){
	var size = req.params.squareSize;

	if(isNaN(size)){
		res.end('Size needs to be a number');
		return;
	}

	size = Number(req.params.squareSize);

	utils.sendRandomImageForSizes(size, size, res);
};

app.get('/:width/:height', MainController);
app.get('/:squareSize', SquareController);
app.listen(3000);