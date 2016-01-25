var utils = require('./utils');

module.exports = {

	RootController: function(req, res){
		res.json({
			specifics: '/:width/:height',
			square: '/:size'
		});
	},

	SpecificsController: function(req, res){
		var width = req.params.width,
			height = req.params.height;

		if(isNaN(width) || isNaN(height)){
			res.end('Both with and height need to be numbers');
			return;
		}

		width = Number(req.params.width);
		height = Number(req.params.height);

		utils.sendRandomImageForSizes(width, height, res);
	},

	SquareController: function(req, res){
		var size = req.params.squareSize;

		if(isNaN(size)){
			res.end('Size needs to be a number');
			return;
		}

		size = Number(req.params.squareSize);

		utils.sendRandomImageForSizes(size, size, res);
	}

};