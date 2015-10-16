var plugins = require(process.cwd() + '/app/services/plugins');
var Controller = plugins.require('controllers/controller');
var ExportController = require('./controller');

module.exports = function(event) {
    var router  = new event.express.Router();
    var factory = new Controller.Factory(ExportController, event.app);
    router.get('/asset/:name', factory.handle('asset'));
    router.get('/compress/:id', factory.handle('compress'));
    router.get('/download/:id', factory.handle('download'));
    return router;
};
