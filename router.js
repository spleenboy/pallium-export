var plugins = require(process.cwd() + '/app/services/plugins');
var Controller = plugins.require('controllers/controller');
var ExportController = require('./controller');

module.exports = function(router, app) {
    var factory = new Controller.Factory(ExportController, app);

    router.get('/asset/:name', factory.handle('asset'));
    router.get('/download/:id', factory.handle('download'));

    app.io.route('export/compress', factory.handle('compress'));
};
