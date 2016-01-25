var controllers = require('./controllers');

module.exports = function(app){

	app.get('/', controllers.RootController);
	app.get('/:width/:height', controllers.SpecificsController);
	app.get('/:squareSize', controllers.SquareController);

};