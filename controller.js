var util  = require('util');
var path = require('path');

var plugins = require(process.cwd() + '/app/services/plugins');
var Parent = plugins.require('controllers/controller');
var config = plugins.require('config');
var log    = plugins.require('services/log')(module);

var directories = require('./directories');

function Controller() {
    Parent.call(this);
    this.viewBase = __dirname;
}

util.inherits(Controller, Parent);


Controller.prototype.asset = function() {
    var name = this.request.params.name;
    var assetpath = path.join(__dirname, 'views', name);
    return this.response.sendfile(assetpath);
};


Controller.prototype.download = function() {
    var id = this.request.params.id;
    var tarpath = directories.compressed[id];

    if (tarpath) {
        this.response.sendfile(tarpath);
    }
};


Controller.prototype.compress = function() {
    var broadcast = this.app.io.broadcast.bind(this.app.io);
    var id = this.request.params.id;
    var data = directories.find(id);

    function done(dest, err) {
        if (err) {
            log.error('Could not compress!', dest, err);
            broadcast('export.error', id);
        } else {
            log.info('Compressed!', dest, err);
            broadcast('export.compressed', id);
        }
    }

    directories.compress(id, done);
};

module.exports = Controller;
