var fs = require('fs'),
	gm = require('gm');

var imagesPath = './img',
	imagePaths = fs.readdirSync(imagesPath).filter(function(path){
		return /\.jpg/.test(path);
	});

var utils = {
	rand: function(min, max){
		return Math.floor(Math.random() * max) + min;
	},

	getRandomImagePath: function(){
		return imagePaths[this.rand(0, (imagePaths.length-1))];
	},

	getRandomImagePathBiggerThan: function(width, height, callback){
		var timesTried = 1,
			maxTries = imagePaths.length,
			self = this;

		var getImagePath = function(callback){
			var imagePath = imagesPath+'/'+self.getRandomImagePath();

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
	}
};

module.exports = {
	sendRandomImageForSizes: function(width, height, res){
		utils.getRandomImagePathBiggerThan(width, height, function(imagePath){

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