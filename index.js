var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var plugins = require(process.cwd() + '/app/services/plugins');

var View = plugins.require('views/view');
var log  = plugins.require('services/log')(module);

var directories = require('./directories');
var router      = require('./router');

var id = 'export';

module.exports = function(hooks, app) {

    var scripts = path.join(__dirname, 'views', 'scripts.js');
    var dest    = fs.createWriteStream(path.join(__dirname, 'views', 'bundle.js'));
    browserify()
        .add(scripts)
        .bundle()
        .pipe(dest);

    // Register routes
    hooks.on('app/bootstrap/routes/registering', function(event) {
        event.routers[id] = router(event);
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
