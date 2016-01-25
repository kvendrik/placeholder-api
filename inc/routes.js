var controllers = require('./controllers');

module.exports = function(app){

	app.get('/', controllers.RootController);
	app.get('/:width([0-9]+)/:height([0-9]+)', controllers.SpecificSizesController);
	app.get('/:squareSize([0-9]+)', controllers.SquareSizeController);
	app.get('/list', controllers.ListController);

};