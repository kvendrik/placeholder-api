var utils = require('./utils'),
	gm = require('gm');

var sendRandomImageForSizes = function(width, height, req, res){

	var handleImage = function(imagePath){
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
	};

	var imageIdx = req.query.image;

	if(imageIdx){
		var imagePaths = utils.getImagePaths();
		imagePath = imagePaths[imageIdx];

		if(!isNaN(imageIdx) && typeof imagePath !== 'undefined'){
			handleImage(imagePath);
			return;
		}
	}

	utils.getRandomImagePathBiggerThan(width, height, function(imagePath){
		if(!imagePath){
			console.error('IMAGE PATH ERR IMAGE_PATH: "'+imagePath+'"');
			res.end('No image found');
			return;
		}
		handleImage(imagePath);
	});
};

module.exports = {

	RootController: function(req, res){
		res.json({
			specificSizes: '/:width/:height?image=:idx',
			squareSize: '/:size?image=:idx',
			list: '/list'
		});
	},

	SpecificSizesController: function(req, res){
		sendRandomImageForSizes(req.params.width, req.params.height, req, res);
	},

	SquareSizeController: function(req, res){
		var size = req.params.squareSize;
		sendRandomImageForSizes(size, size, req, res);
	},

	ListController: function(req, res){
		var imagePaths = utils.getImagePaths(),
			output = [];

		imagePaths.forEach(function(path, idx){
			var imageSize = utils.getImageSize(path, function(size){
				output.push({
					id: idx,
					path: path.replace('./', '/'),
					width: size.width,
					height: size.height
				});

				if(idx === imagePaths.length-1){
					output = output.sort(function(a, b){
						return (a.id < b.id) ? -1 : 1;
					});

					res.json(output);
				}
			});
		});
	}

};