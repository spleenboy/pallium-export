var path = require('path');
var fs = require('fs');
var plugins = require(process.cwd() + '/app/services/plugins');

var View = plugins.require('views/view');
var log  = plugins.require('services/log')(module);

var directories = require('./directories');
var router      = require('./router');

var id = 'export';

module.exports = function(hooks, app) {

    hooks.on('app/bootstrap/scripts/bundling', function(event) {
        event.scripts.push(path.join(__dirname, 'views', 'scripts.js'));
    });

    // Register routes
    hooks.on('app/bootstrap/routes/registering', function(register) {
         register(id, router);
    });

    // Add menu items
    hooks.on('app/controllers/controller/populating', function(event) {
        var data = {};
        data.directories = directories.find();
        var view = new View('menu', data);
        view.base = path.join(__dirname, '/views');
        event.data.sidebar[id] = view.render();
    });
};
