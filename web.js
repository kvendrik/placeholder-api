var fs = require('fs'),
	gm = require('gm'),
	app = require('express')();

var port = process.env.PORT || 3000;

require('./inc/routes')(app);

app.listen(port);
console.log('Listening on *:'+port);