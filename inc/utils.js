var fs = require('fs'),
	gm = require('gm');

var imagePaths = fs.readdirSync('./img')
.filter(function(path){
	return /\.jpg/.test(path);
})
.map(function(path){
	return './img/'+path;
});

module.exports = {
	getImagePaths: function(){
		return imagePaths;
	},

	rand: function(min, max){
		return Math.floor(Math.random() * max) + min;
	},

	getRandomImagePath: function(){
		return imagePaths[this.rand(0, (imagePaths.length-1))];
	},

	getImageSize: function(imagePath, callback){
		gm(imagePath)
		.size(function(err, size){
		  	if(err){
		  		console.error('GM GET SIZE ERROR', err);
		  		return;
		  	}

		  	callback(size);
		});
	},

	getRandomImagePathBiggerThan: function(width, height, callback){
		var timesTried = 1,
			maxTries = imagePaths.length,
			self = this;

		var getImagePath = function(callback){
			var imagePath = self.getRandomImagePath();

			self.getImageSize(imagePath, function(size){
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